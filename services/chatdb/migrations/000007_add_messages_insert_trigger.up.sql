BEGIN;

CREATE FUNCTION check_user_in_group() RETURNS TRIGGER AS $$
    BEGIN
        -- Check if the user is a member of the group
        IF NOT EXISTS (
            SELECT 1
            FROM members
            WHERE user_id = NEW.user_id
            AND group_id = NEW.group_id
        ) THEN
            RAISE EXCEPTION 'User % is not a member of group %', NEW.user_id, NEW.group_id;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION increment_unread_count() RETURNS TRIGGER AS $$
    BEGIN
        -- Increments unread_count of all users in the group except the sender
        UPDATE members
        SET unread_count = LEAST(unread_count + 1, 99)
        WHERE group_id = NEW.group_id
            AND user_id != NEW.user_id;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_messages_insert
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION check_user_in_group();

CREATE TRIGGER after_messages_insert
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION increment_unread_count();

COMMIT;