CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE PROCEDURE create_transaction(_origin UUID, _destination UUID, _amount BIGINT)
LANGUAGE plpgsql
AS $$
	DECLARE 
		transaction_timestamp TIMESTAMP;

		current_amount_origin BIGINT;
		current_amount_destin BIGINT;

		next_value_origin BIGINT;
		next_value_destin BIGINT;
	BEGIN
		transaction_timestamp := current_timestamp;

		current_amount_origin := (
      SELECT amount
			FROM ligapay$develop."Wallet"
			WHERE id = _origin
			FOR NO KEY UPDATE NOWAIT
    );
		
		IF current_amount_origin < _amount THEN
			ROLLBACK;
			RAISE EXCEPTION 'Wallet have insuficient funds.';
		END IF;
		
		current_amount_destin := (
      SELECT amount
			FROM ligapay$develop."Wallet"
			WHERE id = _destination
			FOR NO KEY UPDATE NOWAIT
    );

		next_value_origin := current_amount_origin - _amount;
		next_value_destin := current_amount_destin + _amount;

		UPDATE ligapay$develop."Wallet"
		SET
			amount = next_value_origin,
			"updatedAt" = transaction_timestamp
		WHERE id = _origin;

		UPDATE ligapay$develop."Wallet"
		SET
			amount = next_value_destin,
			"updatedAt" = transaction_timestamp
		WHERE id = _destination;

		INSERT INTO ligapay$develop."Transaction"
			(id, "createdAt", "updatedAt", amount, wallet_destination_id, wallet_origin_id) values 
			(uuid_generate_v4(), transaction_timestamp, transaction_timestamp, _amount, _destination, _origin);

		COMMIT;
	END;
$$;