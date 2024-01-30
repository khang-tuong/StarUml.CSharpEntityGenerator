const fs = require("fs");
const writer = require("./entityWriter");
const path = require("path");
const contextWriter = require("./context-writer");

class CodeGenerator {
  constructor() {
    this.entities = [];
    this.relationships = [];
  }

  generateNewEntity(entityView) {
    let entity = {};
    entity.name = entityView.nameLabel.text;

    const viewColumns = entityView.model.columns;
    entity.props = [];

    for (let i = 0; i < viewColumns.length; i++) {
      const column = viewColumns[i];
      entity.props.push(column);
    }

    this.entities.push(entity);
  }

  generateNewRelationship(relationshipView) {
    let end1 = relationshipView.model.end1;
    let end2 = relationshipView.model.end2;

    let relationship = {
      end1: {
        name: end1.name,
        cardinality: end1.cardinality,
        table: end1.reference.name
      },
      end2: {
        name: end2.name,
        cardinality: end2.cardinality,
        table: end2.reference.name
      }
    };

    this.relationships.push(relationship);
  }

  generate(info) {
    const views = info.diagram.ownedViews;
    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      if (view.constructor.name === "ERDEntityView") {
        this.generateNewEntity(view);
      } else if (view.constructor.name === "ERDRelationshipView") {
        this.generateNewRelationship(view);
      }
    }
    this.generateFiles(info);
  }

  generateFiles(info) {
    let filePath = info.filePath;

    // Remove redundant '/' at the end (if has)
    if (filePath[filePath.length - 1] === "/") {
      filePath = filePath.substring(0, filePath.length - 1);
    }
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];

      const entityRelationship = this.relationships.filter(
        x => x.end1.table === entity.name || x.end2.table === entity.name
      );

      let entityWriter = new writer.EntityWriter(
        entity,
        entityRelationship,
        info
      );
      fs.writeFileSync(
        filePath + `\\${entity.name}.cs`,
        entityWriter.getData()
      );
    }

    let cWriter = new contextWriter.ContextWriter(
      this.entities,
      this.relationships,
      info.namespace
    );

    let contextLines = cWriter.getLines();
    fs.writeFileSync(filePath + `\\ApplicationDbContext.cs`, contextLines);
  }
}

function generateCode(info) {
  const generator = new CodeGenerator();
  generator.generate(info);
}

exports.generateCode = generateCode;
