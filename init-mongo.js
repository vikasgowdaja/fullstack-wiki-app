// Initialize MongoDB collections and indexes
db = db.getSiblingDB('wiki-manager');

// Create users collection with indexes
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'role'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        role: { 
          enum: ['viewer', 'editor', 'admin'],
          description: 'User role'
        },
        department: { bsonType: 'string' },
        isActive: { bsonType: 'bool' },
        lastLogin: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes for users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

// Create wikipages collection with indexes
db.createCollection('wikipages', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'content', 'category'],
      properties: {
        _id: { bsonType: 'objectId' },
        title: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        content: { bsonType: 'string' },
        category: { 
          enum: ['infrastructure', 'deployment', 'security', 'database', 'monitoring', 'troubleshooting', 'application', 'other'],
          description: 'Wiki page category'
        },
        author: { bsonType: 'objectId' },
        lastEditedBy: { bsonType: 'objectId' },
        tags: { bsonType: 'array' },
        version: { bsonType: 'int' },
        isPublished: { bsonType: 'bool' },
        isPinned: { bsonType: 'bool' },
        viewCount: { bsonType: 'int' },
        versions: { bsonType: 'array' },
        comments: { bsonType: 'array' },
        attachments: { bsonType: 'array' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes for wikipages
db.wikipages.createIndex({ slug: 1 }, { unique: true });
db.wikipages.createIndex({ title: 'text', content: 'text', tags: 'text' });
db.wikipages.createIndex({ category: 1, createdAt: -1 });
db.wikipages.createIndex({ author: 1 });
db.wikipages.createIndex({ isPublished: 1 });
db.wikipages.createIndex({ createdAt: -1 });
db.wikipages.createIndex({ updatedAt: -1 });

print('✅ Wiki Manager database initialized successfully');
print('📊 Collections created: users, wikipages');
print('🔍 Indexes created for optimized queries');
