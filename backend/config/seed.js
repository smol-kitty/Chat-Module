const db = require("./db");

async function seed() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL,
        name VARCHAR(50) NOT NULL,
        semester TINYINT NOT NULL,
        degree VARCHAR(10) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        profile_pic VARCHAR(255) DEFAULT 'default.jpg'
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        teacher_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL,
        name VARCHAR(50) NOT NULL,
        department VARCHAR(50) NOT NULL,
        specialization VARCHAR(50) NOT NULL,
        profile_pic VARCHAR(255) DEFAULT 'default.jpg',
        active BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS administrators (
        admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL,
        name VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL,
        profile_pic VARCHAR(255) DEFAULT 'default.jpg',
        active BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);
    await db.query(`CREATE TABLE IF NOT EXISTS photo_counter (
        id INT PRIMARY KEY AUTO_INCREMENT
    )`);
    await db.query(`CREATE TABLE IF NOT EXISTS photo_counter (
  id INT PRIMARY KEY AUTO_INCREMENT
);`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS groups_list (
        group_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        group_name VARCHAR(50) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted BOOLEAN NOT NULL DEFAULT FALSE,
        deleted_at DATETIME DEFAULT NULL,
        creator_type TINYINT NOT NULL,
        created_by BIGINT NOT NULL,
        admin_only BOOLEAN NOT NULL,
        profile_pic VARCHAR(255) DEFAULT 'default.jpg'
      )
    `);
    await db.query(`
    CREATE TABLE IF NOT EXISTS group_members (
    member_id BIGINT NOT NULL,
    member_type TINYINT NOT NULL,
    group_id BIGINT NOT NULL,
    admin_status TINYINT(1) NOT NULL DEFAULT '0',
    joined_at JSON NOT NULL,
    left_at JSON DEFAULT NULL,
    PRIMARY KEY (member_id, member_type, group_id),
    KEY group_id (group_id),
    CONSTRAINT group_members_ibfk_1 FOREIGN KEY (group_id) REFERENCES groups_list(group_id)
  )
`);

    await db.query(`
      CREATE TABLE IF NOT EXISTS group_chats (
    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_type TINYINT NOT NULL,             -- 1=student, 2=teacher, 3=admin
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,              -- References group_id from groups_list
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(250) NOT NULL,
    tagged JSON,                              -- Optional: mentions or metadata
    files JSON DEFAULT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,   -- Soft-delete flag
    deleted_time DATETIME DEFAULT NULL,       -- Timestamp when deleted
    FOREIGN KEY (receiver_id) REFERENCES groups_list(group_id)
);

    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS group_replies (
        reply_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        sender_type TINYINT NOT NULL,
        sender_id BIGINT NOT NULL,
        receiver_id BIGINT NOT NULL,
        parent_id BIGINT NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        message VARCHAR(250) NOT NULL,
        tagged JSON,
        deleted BOOLEAN NOT NULL DEFAULT FALSE,   -- Soft-delete flag
    deleted_time DATETIME DEFAULT NULL,       -- Timestamp when deleted
        FOREIGN KEY (parent_id) REFERENCES group_chats(chat_id),
        FOREIGN KEY (receiver_id) REFERENCES groups_list(group_id)
      )
    `);

    await db.query(`
  CREATE TABLE IF NOT EXISTS individual_chats (
    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_type TINYINT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_type TINYINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(250) NOT NULL,
    tagged BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,   -- Soft-delete flag
    deleted_time DATETIME DEFAULT NULL        -- Timestamp when deleted
  )
`);

    await db.query(`
  CREATE TABLE IF NOT EXISTS individual_replies (
    reply_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_type TINYINT NOT NULL,
    sender_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    message VARCHAR(250) NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tagged BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,   -- Soft-delete flag
    deleted_time DATETIME DEFAULT NULL,       -- Timestamp when deleted
    FOREIGN KEY (parent_id) REFERENCES individual_chats(chat_id)
  )
`);

    console.log("✅ All tables created successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    process.exit(1);
  }
}

seed();
