# TypeORM Cheat Sheet & Comprehensive Guide

## Table of Contents

1. [What is TypeORM?](#what-is-typeorm)
2. [Why Use TypeORM Over Raw SQL?](#why-use-typeorm-over-raw-sql)
3. [Key Features & Benefits](#key-features--benefits)
4. [Architecture & Implementation](#architecture--implementation)
5. [Installation & Setup](#installation--setup)
6. [Entity Definition](#entity-definition)
7. [Basic CRUD Operations](#basic-crud-operations)
8. [Relationships](#relationships)
9. [Query Building](#query-building)
10. [Migrations](#migrations)
11. [Advanced Features](#advanced-features)
12. [Performance Considerations](#performance-considerations)

## What is TypeORM?

TypeORM is an Object-Relational Mapper (ORM) for TypeScript and JavaScript that runs on Node.js. It allows you to work with databases using object-oriented approaches instead of writing raw SQL queries.

**Under the hood**: TypeORM is written in TypeScript and translates your object-oriented operations into optimized SQL queries for various databases (PostgreSQL, MySQL, MariaDB, SQLite, MS SQL Server, Oracle, etc.).

## Why Use TypeORM Over Raw SQL?

1. **Database Abstraction**: Write code once, use with multiple database systems
2. **Type Safety**: Leverage TypeScript's type system for better code quality
3. **Productivity**: Reduce boilerplate code for common operations
4. **Maintainability**: Database schema represented as classes with relationships
5. **Migrations**: Version control for database schema changes

## Key Features & Benefits

- **Entity-Based Modeling**: Define database structure using classes with decorators
- **Repository Pattern**: Consistent API for database operations
- **Relationship Handling**: Easy management of database relations (1:1, 1:N, N:N)
- **Query Builder**: Type-safe query construction
- **Migrations**: Track and apply database schema changes
- **Transactions**: ACID-compliant operations
- **Caching**: Performance optimization through query caching
- **Multiple Database Support**: Unified API for different SQL databases

## Architecture & Implementation

TypeORM follows the Data Mapper pattern (with optional Active Record support):

1. **Entities**: Classes mapped to database tables
2. **Repositories**: Perform database operations on entities
3. **Query Builder**: Programmatic SQL query construction
4. **Migrations**: Schema change management
5. **Subscribers**: Event listeners for database operations

**Language**: Built with TypeScript, compiles to JavaScript
**Pattern**: Implements Data Mapper pattern (recommended) with Active Record option

## Installation & Setup

```bash
npm install typeorm reflect-metadata pg
npm install @types/node --save-dev
```

```typescript
// app.ts
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: [User],
  synchronize: true, // ONLY for development!
  logging: true,
})
  .then((connection) => {
    // Start working with entities
  })
  .catch((error) => console.log(error));
```

## Entity Definition

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  // Virtual property (not stored in database)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

## Basic CRUD Operations

### Using Repository Pattern

```typescript
// Create
const user = new User();
user.firstName = 'John';
user.lastName = 'Doe';
user.age = 25;
await userRepository.save(user);

// Read
const users = await userRepository.find();
const john = await userRepository.findOne({ firstName: 'John' });
const userById = await userRepository.findOne(1);

// Update
user.age = 26;
await userRepository.save(user);

// Or update directly
await userRepository.update(1, { age: 26 });

// Delete
await userRepository.remove(user);
// Or delete by ID
await userRepository.delete(1);
```

### Using Active Record Pattern

```typescript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  // ...columns

  // Now you can call methods directly on instances
  static async findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder('user')
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany();
  }
}

// Usage
const user = new User();
user.firstName = 'John';
user.lastName = 'Doe';
await user.save();

const users = await User.find();
const johns = await User.findByName('John', 'Doe');
```

## Relationships

### One-to-One

```typescript
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}

@Entity()
export class User {
  // ...other columns

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
```

### One-to-Many / Many-to-One

```typescript
@Entity()
export class User {
  // ...other columns

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}
```

### Many-to-Many

```typescript
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

## Query Building

### Basic Query Builder

```typescript
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .where('user.age > :age', { age: 18 })
  .andWhere('user.firstName = :name', { name: 'John' })
  .orderBy('user.lastName', 'DESC')
  .getMany();
```

### Joins

```typescript
const usersWithPhotos = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .where('user.age > :age', { age: 18 })
  .getMany();
```

### Subqueries

```typescript
const qb = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .where(
    'user.age IN ' +
      connection
        .createQueryBuilder()
        .select('user.age')
        .from(User, 'user')
        .where('user.age > 18')
        .getQuery(),
  )
  .getMany();
```

### Pagination

```typescript
const [users, totalCount] = await userRepository.findAndCount({
  skip: 10, // offset
  take: 5, // limit
  order: { createdAt: 'DESC' },
});
```

## Migrations

### Generate Migration

```bash
typeorm migration:generate -n CreateUserTable
```

### Migration File

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable123456789 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user (
        id int NOT NULL AUTO_INCREMENT,
        firstName varchar(255) NOT NULL,
        lastName varchar(255) NOT NULL,
        age int NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user');
  }
}
```

### Run Migrations

```bash
typeorm migration:run
```

### Revert Migrations

```bash
typeorm migration:revert
```

## Advanced Features

### Transactions

```typescript
await connection.transaction(async (transactionalEntityManager) => {
  const user = new User();
  user.firstName = 'John';
  await transactionalEntityManager.save(user);

  const profile = new Profile();
  profile.user = user;
  await transactionalEntityManager.save(profile);
});
```

### Listeners & Subscribers

```typescript
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    console.log('BEFORE USER INSERTED: ', event.entity);
  }

  afterInsert(event: InsertEvent<User>) {
    console.log('AFTER USER INSERTED: ', event.entity);
  }
}
```

### Indexes

```typescript
@Entity()
@Index(['firstName', 'lastName'])
export class User {
  @Index()
  @Column()
  email: string;

  // ...other columns
}
```

### Entity Inheritance

```typescript
abstract class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}

@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}

@Entity()
export class Question extends Content {
  @Column()
  answersCount: number;
}
```

## Performance Considerations

1. **Eager vs Lazy Relations**: Be mindful of loading strategies
2. **Indexing**: Properly index frequently queried columns
3. **Pagination**: Always paginate large result sets
4. **Select Specific Columns**: Avoid `SELECT *` when possible
5. **Caching**: Use query caching for frequently executed queries
6. **Avoid N+1 Queries**: Use joins or the `RelationId` decorator

```typescript
// Bad: N+1 query problem
const users = await userRepository.find();
for (const user of users) {
  const photos = await user.photos; // Executes query for each user
}

// Good: Join in single query
const users = await userRepository.find({ relations: ['photos'] });
```

## Common Decorators Reference

| Decorator                   | Purpose                               |
| --------------------------- | ------------------------------------- |
| `@Entity()`                 | Marks class as database entity        |
| `@Column()`                 | Maps property to table column         |
| `@PrimaryColumn()`          | Marks as primary key                  |
| `@PrimaryGeneratedColumn()` | Auto-increment primary key            |
| `@CreateDateColumn()`       | Automatically sets creation date      |
| `@UpdateDateColumn()`       | Automatically sets update date        |
| `@VersionColumn()`          | Increments on update                  |
| `@OneToOne()`               | Defines one-to-one relationship       |
| `@OneToMany()`              | Defines one-to-many relationship      |
| `@ManyToOne()`              | Defines many-to-one relationship      |
| `@ManyToMany()`             | Defines many-to-many relationship     |
| `@JoinColumn()`             | Customizes owner side of relationship |
| `@JoinTable()`              | Customizes owner of many-to-many      |
| `@Index()`                  | Creates database index                |
| `@Unique()`                 | Creates unique constraint             |
| `@Transaction()`            | Marks method as transactional         |
| `@EntityRepository()`       | Marks class as custom repository      |

This cheat sheet covers the essential aspects of TypeORM. For more detailed information, refer to the [official TypeORM documentation](https://typeorm.io/).
