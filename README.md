# 📦 Node.js + Prisma + PostgreSQL + Docker

A production-ready Node.js backend using:

✅ PostgreSQL in Docker  
✅ Prisma ORM  
✅ Express server with secure sessions stored in Postgres  
✅ Zod for request validation  
✅ Prisma migrations to manage schema  
✅ Scripts for **backup** and **restore** of the database.

---

## ✅ Features

- 🔄 **Full CRUD operations with Prisma**  
  Easily manage your database records with Prisma’s type-safe ORM.

- 🛡️ **Express middleware with security best practices**  
  Integrated `helmet`, `compression`, and `cors` to secure and optimize your API.

- 🗝️ **Session management with PostgreSQL storage**  
  Persistent user sessions using `express-session` with `connect-pg-simple` backed by PostgreSQL.

- 📦 **Prisma migrations and client generation**  
  Keep your database schema in sync with your application code through Prisma migrations.

- 🗂️ **Backup and restore scripts for easy database maintenance**  
  Bash scripts included for creating and restoring PostgreSQL backups with ease.

## 📁 Project Structure

```
└── 📁postgres_backend
    └── 📁api
        └── 📁attendance
            ├── attendance.controller.js
            ├── attendance.routes.js
            ├── attendance.schema.js
        └── 📁member
            ├── member.controller.js
            ├── member.routes.js
            ├── member.schema.js
        └── 📁payment
            ├── payment.controller.js
            ├── payment.routes.js
            ├── payment.schema.js
        └── 📁turnout
            ├── turnout.controller.js
            ├── turnout.routes.js
            ├── turnout.schema.js
        └── 📁user
            ├── user.controller.js
            ├── user.routes.js
            ├── user.schema.js
            ├── users.test.js
    └── 📁avatar
        ├── avatar.png
    └── 📁db
        ├── access.log
        ├── data.txt
        ├── db.js
        ├── mockmembers.sql
        ├── prismaClient.js
        ├── table.sql
    └── 📁helpers
        ├── helpers.js
    └── 📁logs
        ├── access.txt
    └── 📁middlewares
        ├── blacklistToken.model.js
        ├── middlewares.js
        ├── zodValidator.js
    └── 📁prisma
        └── 📁migrations
            └── 📁20250626223642_init
                ├── migration.sql
            └── 📁20250626224114_init
                ├── migration.sql
            ├── migration_lock.toml
        ├── dev.js
        ├── prisma.js
        ├── schema.prisma
        ├── seed.js
    └── 📁routes
        ├── routes.js
    └── 📁scripts
        ├── backup.sh
        ├── export.sh
        ├── import.sh
    ├── .env
    ├── app.js
    ├── app.test.js
    ├── babel.config.js
    ├── doc
    ├── docker-compose.yml
    ├── Dockerfile
    ├── Dockerfile.dev
    ├── index.js
    ├── jest.config.js
    ├── Models.txt
    ├── nodemon.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── universalTypes.d.ts
```

```yaml

**Explanation of key folders & files:**

- **db/**
  Contains database-related files: backups & logs.

- **helpers/**
  Utility functions for environment config, ID generation, authentication helpers, etc.

- **prisma/**
  All Prisma ORM-related files: your schema, migrations, and generated client.

- **routes/**
  Express router files defining your API endpoints.

- **scripts/**
  Useful shell scripts for database maintenance (backup/restore).

- **avatar/**
  Directory for uploaded profile pictures or static files.

- **frontend/**
  Contains your frontend build output (optional), served by the Express server.

- **server.js**
  Entry point for the Express app; includes middleware, session config, and router setup.

```

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model user_sessions {
  sid    String   @id(map: "session_pkey") @db.VarChar
  sess   Json     @db.Json
  expire DateTime @db.Timestamp(6)

  @@index([expire], map: "IDX_session_expire")
}

model attendance {
  id            Int      @id @default(autoincrement())
  memberid      Int
  turnoutid     Int
  date          DateTime @db.Date
  participation String?
  remarks       String?
  members       members  @relation(fields: [memberid], references: [id], onDelete: Cascade, onUpdate: NoAction)
  turnout       turnout  @relation(fields: [turnoutid], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@unique([memberid, turnoutid])
}

model members {
  id                           Int          @id @default(autoincrement())
  membername                   String
  firstname                    String
  lastname                     String
  email                        String       @unique
  phone                        String?
  position                     String?
  dateofbirth                  DateTime?    @db.Date
  occupation                   String?
  otherskills                  String?
  profilepicture               String?
  emergencycontactphone        String?
  emergencycontactname         String?
  emergencycontactrelationship String?
  joindate                     DateTime?    @db.Date
  membershiptype               String?
  status                       String?
  attendance                   attendance[]
  payment                      payment[]
  profile                      profile?
}

model payment {
  id            Int      @id @default(autoincrement())
  memberid      Int
  amount        Decimal  @db.Decimal(10, 2)
  paymentdate   DateTime @db.Date
  paymentmethod String?
  assessmentid  Int?
  members       members  @relation(fields: [memberid], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model profile {
  id        Int     @id @default(autoincrement())
  memberid  Int     @unique
  firstname String?
  lastname  String?
  pictururl String?
  members   members @relation(fields: [memberid], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model turnout {
  id          Int          @id @default(autoincrement())
  name        String
  description String?
  turnoutdate DateTime     @db.Date
  location    String?
  organizer   String?
  status      String?
  attendance  attendance[]
}

```

```bash
npx prisma db pull
npx prisma generate
npx prisma migrate dev --name init

```

---

# 🔒 Session Setup (Express)

### Sessions are stored in Postgres using connect-pg-simple with secure cookie config:

```javascript
const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({ pool: pgPool, tableName: "user_sessions" }),
    secret: process.env.COOKIE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: process.env.COOKIE_SESSION_NAME,
    cookie: {
      secure: false, // set to true behind HTTPS
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      sameSite: "lax",
    },
  })
);
```

# 🗂 Scripts

### scripts/backup.sh

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M)
FILENAME="backup_$DATE.sql"

docker exec -t my_postgres pg_dump -U postgres -d mydb > "./db/$FILENAME"

echo "✅ Backup saved to ./db/$FILENAME"

```

### scripts/restore.sh

```bash
#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ Usage: ./scripts/restore.sh path/to/backup.sql"
  exit 1
fi

docker exec -i my_postgres psql -U postgres -d mydb < "$1"

echo "✅ Database restored from $1"

```

# 📖 Full API CRUD Documentation

## 📌 Base URL

- localhost:7240/api

---

## 🚨 Authentication

Some endpoints may require session or authentication. Adjust middleware as needed.

---

## 🧑‍🤝‍🧑 Members

### ➕ Create Member

**POST** `localhost:7240/api/members/`

**Request Body:**

```json
{
  "membername": "John Doe",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "position": "Treasurer",
  "dateofbirth": "1990-05-15",
  "occupation": "Engineer",
  "otherskills": "Public Speaking",
  "profilepicture": "profile.jpg",
  "emergencycontactphone": "+0987654321",
  "emergencycontactname": "Jane Doe",
  "emergencycontactrelationship": "Spouse",
  "joindate": "2023-01-01",
  "membershiptype": "Regular",
  "status": "Active"
}
```

---

## 📄 Get All Members

### GET /api/members

**GET** `localhost:7240/api/members/`

## 📄 Get Members By ID

### GET /api/members/id

**GET** `localhost:7240/api/members/id`

## 📄 Update Member

### PATCH /api/members/id

**PATCH** `localhost:7240/api/members/id`

```json
// Request Body
{
  "phone": "+1122334455",
  "status": "Inactive"
}
```

## 📄 Delete Member

### DELETE /api/members/id

**DELETE** `localhost:7240/api/members/id`

---

## 🗓 Attendance

### ➕ Create Attendance

**POST** `localhost:7240/api/attendance/`

**_Request Body_**

```json
// Request Body
{
  "memberid": 1,
  "turnoutid": 1,
  "date": "2024-06-20",
  "participation": "Yes",
  "remarks": "Participated actively"
}
```

## Get All Attendance Records

### GET /api/attendance/

**GET** `localhost:7240/api/attendance/`

## Get Attendance by ID

### GET /api/attendance/id

**GET** `localhost:7240/api/attendance/id`

## UPDATE Attendance by ID

### PATCH /api/attendance/id

**PATCH** `localhost:7240/api/attendance/id`

**_Request Body_**

```json
// Request Body
{
  "memberid": 1,
  "turnoutid": 1,
  "date": "2024-06-20",
  "participation": "Abscent",
  "remarks": "Participated actively"
}
```

## Delete Attendance by ID

### DELETE /api/attendance/id

**DELETE** `localhost:7240/api/attendance/id`

## 💳 Payment

### ➕ Create Payment

### POST /api/payments

**POST** `localhost:7240/api/payment/`

**_Request Body:_**

```json
{
  "memberid": 1,
  "amount": 50.0,
  "paymentdate": "2024-06-20",
  "paymentmethod": "Credit Card",
  "assessmentid": 5
}
```

## GET All Payments

### GET /api/payments

**GET** `localhost:7240/api/payment/`

## GET Payments By Id

### GET /api/payments/id

**GET** `localhost:7240/api/payment/id`

## GET Payments By Id

### GET /api/payments/id

**GET** `localhost:7240/api/payment/id`

## UPDATE Payments By Id

### GET /api/payments/id

**GET** `localhost:7240/api/payment/id`
