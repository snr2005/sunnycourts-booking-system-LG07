-- Initial Seed Data for SunnyCourts Club

-- Insert sample players (including Asha for twist tests)
INSERT INTO players (name, email) VALUES
('Asha', 'asha@sunnycourts.club'),
('Rohan', 'rohan@sunnycourts.club'),
('Maya', 'maya@sunnycourts.club');

-- Insert sample courts (name and sport)
INSERT INTO courts (name, sport) VALUES
('Court 1 - North Lawn', 'Tennis'),
('Court 2 - South Lawn', 'Tennis'),
('Court 3 - Clay Arena', 'Tennis'),
('Court 4 - Indoor Squash', 'Squash'),
('Court 5 - Badminton Hall', 'Badminton');

-- Insert sample reservations
INSERT INTO reservations (player_id, court_id, slot_time, status) VALUES
(2, 1, '2026-11-06 18:00', 'active'),
(3, 4, '2026-11-06 19:00', 'active');
