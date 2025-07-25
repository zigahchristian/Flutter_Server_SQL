-- ========================
-- Schema: Membership System
-- ========================

-- MEMBER Table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    membername TEXT NOT NULL,
    firstname  TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    position TEXT,
    dateofbirth DATE,
    occupation TEXT,
    otherskills TEXT,
    profilepicture TEXT DEFAULT 'avatar.png',
    publicprofilepictureurl TEXT DEFAULT 'avatar.png', -- Default public profile picture
    emergencycontactphone TEXT,
    emergencycontactname TEXT,
    emergencycontactrelationship TEXT,
    joinDate DATE,
    membershipType TEXT,
    status TEXT
);

-- TURNOUT Table
CREATE TABLE IF NOT EXISTS turnout (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    turnoutdate DATE NOT NULL,
    location TEXT,
    organizer TEXT,
    status TEXT
);

-- ATTENDANCE Table (Links MEMBER and TURNOUT)
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    memberid INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    turnoutid INTEGER NOT NULL REFERENCES turnout(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    participation TEXT,
    remarks TEXT,
    UNIQUE(memberid, turnoutid) -- Prevent duplicate attendance per member per event
);

-- PAYMENT Table
CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    memberid INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    paymentdate DATE NOT NULL,
    paymentmethod TEXT,
    assessmentid INTEGER
    -- Optionally: REFERENCES assessment(id)
);

-- PROFILE Table (One-to-One with MEMBER)
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    memberid INTEGER UNIQUE NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    firstname TEXT,
    lastname TEXT,
    pictururl TEXT
);
