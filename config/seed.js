const db = require("./db");

async function seed() {
  try {
    // STUDENTS
    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL,
        name VARCHAR(50) NOT NULL,
        semester TINYINT NOT NULL,
        degree VARCHAR(10) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    // TEACHERS
    await db.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        teacher_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL,
        name VARCHAR(50) NOT NULL,
        department VARCHAR(50) NOT NULL,
        specialization VARCHAR(50) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    // ADMINISTRATORS
    await db.query(`
      CREATE TABLE IF NOT EXISTS administrators (
        admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL,
        name VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    // GROUPS
    await db.query(`
      CREATE TABLE IF NOT EXISTS groups_list (
        group_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        group_name VARCHAR(50) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted BOOLEAN NOT NULL DEFAULT FALSE,
        deleted_at DATETIME DEFAULT NULL,
        creator_type TINYINT NOT NULL,
        created_by BIGINT NOT NULL,
        admin_only BOOLEAN NOT NULL
      )
    `);

    // GROUP MEMBERS
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

    // GROUP CHATS
    await db.query(`
      CREATE TABLE IF NOT EXISTS group_chats (
        chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        sender_type TINYINT NOT NULL,
        sender_id BIGINT NOT NULL,
        receiver_id BIGINT NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        message VARCHAR(250) NOT NULL,
        tagged JSON,
        FOREIGN KEY (receiver_id) REFERENCES groups_list(group_id)
      )
    `);

    // GROUP REPLIES
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
        FOREIGN KEY (parent_id) REFERENCES group_chats(chat_id),
        FOREIGN KEY (receiver_id) REFERENCES groups_list(group_id)
      )
    `);

    // INDIVIDUAL CHAT
    await db.query(`
      CREATE TABLE IF NOT EXISTS individual_chat (
        chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        sender_type TINYINT NOT NULL,
        sender_id BIGINT NOT NULL,
        receiver_type TINYINT NOT NULL,
        receiver_id BIGINT NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        message VARCHAR(250) NOT NULL,
        tagged BOOLEAN NOT NULL
      )
    `);

    // INDIVIDUAL REPLIES
    await db.query(`
      CREATE TABLE IF NOT EXISTS individual_replies (
        reply_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        sender_type TINYINT NOT NULL,
        sender_id BIGINT NOT NULL,
        parent_id BIGINT NOT NULL,
        message VARCHAR(250) NOT NULL,
        time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        tagged BOOLEAN NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES individual_chat(chat_id)
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
