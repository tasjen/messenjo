BEGIN;

CREATE FUNCTION delete_group_if_no_members() RETURNS TRIGGER AS $$
    BEGIN
    -- Delete the group if there is no members left
        IF NOT EXISTS (
            SELECT 1
            FROM members
            WHERE group_id = OLD.group_id
        ) THEN
            DELETE FROM groups
            WHERE id = OLD.group_id;
        END IF;
        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_members_delete
AFTER DELETE ON members
FOR EACH ROW
EXECUTE FUNCTION delete_group_if_no_members();

COMMIT;