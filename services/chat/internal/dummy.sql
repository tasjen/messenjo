BEGIN;
	INSERT INTO users (id, username) VALUES -- create users
		('18895dad-3394-4c07-8c10-a75f313b5265', 'one'),
		('e6afe644-e920-46af-95b4-ea7385f353a7', 'two'),
		('740b4b5e-9417-4290-b125-084da8e6d2dd', 'three'),
		('6698417c-37c5-4d46-8a91-5f4c2a60b46a', 'four'),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'five'),
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'six'),
		('65984514-6211-4de3-9f96-9ce027c010ea', 'seven'),
		('02b37cb8-a9b7-4400-8fd4-6bc7ef28c9c4', 'eight');

	INSERT INTO groups (id, name) VALUES -- create groups
		('10a3788a-d634-4ea6-b492-7d9dc4ef2230', ''), -- group1
		('8e133c8a-6c18-420a-81e4-1a1aa6415450', ''), -- group2
		('2b3a41df-a3d6-4165-8f80-48089245a36e', ''), -- group3
		('6ee39a68-c2df-46c8-b554-9c6792fbf676', ''), -- group4
		('f1f0cfb5-fab9-416b-8815-3dbad782db09', 'dummy_group');

	INSERT INTO members (user_id, group_id) VALUES -- add friends
		('d868e26e-5499-449f-9351-070691d7efda', '10a3788a-d634-4ea6-b492-7d9dc4ef2230'), -- github & one friends
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230'),
		
		('d868e26e-5499-449f-9351-070691d7efda', '8e133c8a-6c18-420a-81e4-1a1aa6415450'), -- github & two friends
		('e6afe644-e920-46af-95b4-ea7385f353a7', '8e133c8a-6c18-420a-81e4-1a1aa6415450'),
		
		('d868e26e-5499-449f-9351-070691d7efda', '2b3a41df-a3d6-4165-8f80-48089245a36e'), -- github & three friends
		('740b4b5e-9417-4290-b125-084da8e6d2dd', '2b3a41df-a3d6-4165-8f80-48089245a36e'),
		
		('d868e26e-5499-449f-9351-070691d7efda', '6ee39a68-c2df-46c8-b554-9c6792fbf676'), -- github & four friends
		('6698417c-37c5-4d46-8a91-5f4c2a60b46a', '6ee39a68-c2df-46c8-b554-9c6792fbf676'),
		
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09'), -- five & six & seven to dummy_group
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'f1f0cfb5-fab9-416b-8815-3dbad782db09'),
		('65984514-6211-4de3-9f96-9ce027c010ea', 'f1f0cfb5-fab9-416b-8815-3dbad782db09');
	
	INSERT INTO messages (user_id, group_id, content, sent_at) VALUES
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'one to github 1', to_timestamp(1714300241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'github to one 1', to_timestamp(1714310241.305)),
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'one to github 2', to_timestamp(1714320241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'github to one 2', to_timestamp(1714330241.305)),
		('18895dad-3394-4c07-8c10-a75f313b5265', '10a3788a-d634-4ea6-b492-7d9dc4ef2230', 'one to github 3', to_timestamp(1714340241.305)),
		('e6afe644-e920-46af-95b4-ea7385f353a7', '8e133c8a-6c18-420a-81e4-1a1aa6415450', 'two to github 1', to_timestamp(1714350241.305)),
		('e6afe644-e920-46af-95b4-ea7385f353a7', '8e133c8a-6c18-420a-81e4-1a1aa6415450', 'two to github 2', to_timestamp(1714360241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '2b3a41df-a3d6-4165-8f80-48089245a36e', 'github to three 1', to_timestamp(1714370241.305)),
		('d868e26e-5499-449f-9351-070691d7efda', '2b3a41df-a3d6-4165-8f80-48089245a36e', 'github to three 2', to_timestamp(1714380241.305)),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'five to dummy_group 1', to_timestamp(1714300241.305)),
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'six to dummy_group 1', to_timestamp(1714310241.305)),
		('65984514-6211-4de3-9f96-9ce027c010ea', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'seven to dummy_group 1', to_timestamp(1714320241.305)),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'five to dummy_group 2', to_timestamp(1714330241.305)),
		('f9fb531d-d2c4-412b-87ea-52223c6a37b0', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'six to dummy_group 2', to_timestamp(1714340241.305)),
		('15d6100e-4c93-47d3-8272-31ddd95e0fce', 'f1f0cfb5-fab9-416b-8815-3dbad782db09', 'five to dummy_group 3', to_timestamp(1714350241.305));
COMMIT;