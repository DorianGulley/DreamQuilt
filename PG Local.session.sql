-- Insert quilt tags
INSERT INTO quilt_tags (quilt_id, tag)
VALUES (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Last City in the Sky'
        ),
        'floating city'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Last City in the Sky'
        ),
        'class divide'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Last City in the Sky'
        ),
        'energy crisis'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'Whispers of the Ancient Forest'
        ),
        'enchanted forest'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'Whispers of the Ancient Forest'
        ),
        'nature magic'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'Whispers of the Ancient Forest'
        ),
        'ancient threat'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Memory Thief'
        ),
        'memory manipulation'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Memory Thief'
        ),
        'detective'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Memory Thief'
        ),
        'identity'
    );
-- Insert mock contributions (optional, for future use)
INSERT INTO contributions (quilt_id, user_id, type, content)
VALUES (
        (
            SELECT id
            FROM quilts
            WHERE title = 'Whispers of the Ancient Forest'
        ),
        (
            SELECT id
            FROM users
            WHERE username = 'alexchen'
        ),
        'plot_twist',
        'The ancient threat is revealed to be a sentient, crystalline entity that feeds on memories.'
    ),
    (
        (
            SELECT id
            FROM quilts
            WHERE title = 'The Memory Thief'
        ),
        (
            SELECT id
            FROM users
            WHERE username = 'alexchen'
        ),
        'character_art',
        'Concept art for the protagonist, a detective with glowing, empty eyes.'
    );
SELECT *
FROM follows;