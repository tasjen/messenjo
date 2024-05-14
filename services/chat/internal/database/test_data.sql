BEGIN;
	INSERT INTO users (id, username) VALUES -- create users
		('d868e26e-5499-449f-9351-070691d7efda', 'user_zero'),
		('18895dad-3394-4c07-8c10-a75f313b5265', 'user_one'),
		('e6afe644-e920-46af-95b4-ea7385f353a7', 'user_two'),
		('740b4b5e-9417-4290-b125-084da8e6d2dd', 'user_three'),
		('6698417c-37c5-4d46-8a91-5f4c2a60b46a', 'user_four'),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'user_five'),
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'user_six'),
		('65984514-6211-4de3-9f96-9ce027c010ea', 'user_seven'),
		('02b37cb8-a9b7-4400-8fd4-6bc7ef28c9c4', 'user_eight');

	INSERT INTO groups (id, name) VALUES -- create groups
		('10a3788a-d634-4ea6-b492-7d9dc4ef2230', ''),
		('8e133c8a-6c18-420a-81e4-1a1aa6415450', ''),
		('2b3a41df-a3d6-4165-8f80-48089245a36e', ''),
		('6ee39a68-c2df-46c8-b554-9c6792fbf676', ''),
		('f1f0cfb5-fab9-416b-8815-3dbad782db09', 'group_one');

	INSERT INTO members (user_id, group_id) VALUES -- add friends
		('d868e26e-5499-449f-9351-070691d7efda', '10a3788a-d634-4ea6-b492-7d9dc4ef2230'), -- user_zero & user_one friend
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230'),
		
		('d868e26e-5499-449f-9351-070691d7efda', '8e133c8a-6c18-420a-81e4-1a1aa6415450'), -- user_zero & user_two friend
		('e6afe644-e920-46af-95b4-ea7385f353a7', '8e133c8a-6c18-420a-81e4-1a1aa6415450'),
		
		('d868e26e-5499-449f-9351-070691d7efda', '2b3a41df-a3d6-4165-8f80-48089245a36e'), -- user_zero & user_three friend
		('740b4b5e-9417-4290-b125-084da8e6d2dd', '2b3a41df-a3d6-4165-8f80-48089245a36e'),
		
		('d868e26e-5499-449f-9351-070691d7efda', '6ee39a68-c2df-46c8-b554-9c6792fbf676'), -- user_zero & user_four friend
		('6698417c-37c5-4d46-8a91-5f4c2a60b46a', '6ee39a68-c2df-46c8-b554-9c6792fbf676'),
		
		('d868e26e-5499-449f-9351-070691d7efda', 'f1f0cfb5-fab9-416b-8815-3dbad782db09'), -- user_zero & user_five & user_six & user_seven group_one
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09'), 
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'f1f0cfb5-fab9-416b-8815-3dbad782db09'),
		('65984514-6211-4de3-9f96-9ce027c010ea', 'f1f0cfb5-fab9-416b-8815-3dbad782db09');
	
	INSERT INTO messages (user_id, group_id, content, sent_at) VALUES
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'user_one to user_zero 1', to_timestamp(1714300241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'user_zero to user_one 1', to_timestamp(1714310241.305)),
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'user_one to user_zero 2', to_timestamp(1714320241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'user_zero to user_one 2', to_timestamp(1714330241.305)),
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'user_one to user_zero 3', to_timestamp(1714340241.305)),
		('e6afe644-e920-46af-95b4-ea7385f353a7', '8e133c8a-6c18-420a-81e4-1a1aa6415450', 'user_two to user_zero 1', to_timestamp(1714350241.305)),
		('e6afe644-e920-46af-95b4-ea7385f353a7', '8e133c8a-6c18-420a-81e4-1a1aa6415450', 'user_two to user_zero 2', to_timestamp(1714360241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '2b3a41df-a3d6-4165-8f80-48089245a36e', 'user_zero to user_three 1', to_timestamp(1714370241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '2b3a41df-a3d6-4165-8f80-48089245a36e', 'user_zero to user_three 2', to_timestamp(1714380241.305)),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_five to group_one 1', to_timestamp(1714390241.305)),
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_six to group_one 1', to_timestamp(1714340241.305)),
		('65984514-6211-4de3-9f96-9ce027c010ea', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_seven to group_one 1', to_timestamp(1714341241.305)),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_five to group_one 2', to_timestamp(1714342241.305)),
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_six to group_one 2', to_timestamp(1714343241.305)),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_five to group_one 3', to_timestamp(1714344241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'user_zero to group_one 1', to_timestamp(1714344241.305));
COMMIT;