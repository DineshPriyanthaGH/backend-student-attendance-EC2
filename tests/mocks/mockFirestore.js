// Mock Firebase service for testing
class MockFirestore {
  constructor() {
    this.collections = {
      grades: new Map(),
      classes: new Map(),
      students: new Map()
    };
    this.idCounter = 1;
  }

  collection(name) {
    return new MockCollection(this.collections[name] || new Map(), this, name);
  }

  reset() {
    this.collections.grades.clear();
    this.collections.classes.clear();
    this.collections.students.clear();
    this.idCounter = 1;
  }

  generateId() {
    return `mock_id_${this.idCounter++}`;
  }
}

class MockCollection {
  constructor(data, firestore, name) {
    this.data = data;
    this.firestore = firestore;
    this.name = name;
  }

  async add(docData) {
    const id = this.firestore.generateId();
    this.data.set(id, docData);
    return { id };
  }

  doc(id) {
    return new MockDocument(this.data, id);
  }

  where(field, operator, value) {
    return new MockQuery(this.data, [{ field, operator, value }]);
  }

  async get() {
    const docs = [];
    for (const [id, data] of this.data.entries()) {
      docs.push({
        id,
        data: () => data,
        exists: true
      });
    }
    return { docs, empty: docs.length === 0 };
  }
}

class MockDocument {
  constructor(collectionData, id) {
    this.collectionData = collectionData;
    this.id = id;
  }

  async get() {
    const data = this.collectionData.get(this.id);
    return {
      exists: !!data,
      id: this.id,
      data: () => data || null
    };
  }

  async update(updates) {
    const existing = this.collectionData.get(this.id);
    if (existing) {
      this.collectionData.set(this.id, { ...existing, ...updates });
    }
    return true;
  }

  async delete() {
    this.collectionData.delete(this.id);
    return true;
  }
}

class MockQuery {
  constructor(collectionData, conditions = []) {
    this.collectionData = collectionData;
    this.conditions = conditions;
  }

  where(field, operator, value) {
    const newConditions = [...this.conditions, { field, operator, value }];
    return new MockQuery(this.collectionData, newConditions);
  }

  async get() {
    const docs = [];
    for (const [id, data] of this.collectionData.entries()) {
      let matches = true;
      for (const condition of this.conditions) {
        if (condition.operator === '==' && data[condition.field] !== condition.value) {
          matches = false;
          break;
        }
      }
      if (matches) {
        docs.push({
          id,
          data: () => data,
          exists: true
        });
      }
    }
    return { docs, empty: docs.length === 0 };
  }
}

module.exports = new MockFirestore();
