const valueTypes = [
  "int",
  "bool",
  "decimal",
  "float",
  "double",
  "byte",
  "long"
];

const stringUtils = require("./string-utils");

class EntityWriter {
  constructor(entity, relationships, info) {
    this.lines = [];
    this.entity = entity;
    this.relationships = relationships;
    this.info = info;
  }

  writeUsing() {
    this.lines.push("using System;");
    this.lines.push("using System.ComponentModel.DataAnnotations;");
    this.lines.push("using System.ComponentModel.DataAnnotations.Schema;");
    this.lines.push("");
  }

  writeNamespace() {
    this.lines.push(`namespace ${this.info.namespace}`);
    this.lines.push("{");
  }

  writeClass() {
    this.lines.push(`    public class ${this.entity.name}`);
    this.lines.push(`    {`);
  }

  writeProps() {
    for (let i = 0; i < this.entity.props.length; i++) {
      const prop = this.entity.props[i];

      if (prop.length !== null && prop.length > 0) {
        this.lines.push(`        [StringLength(${prop.length})]`);
      }

      if (prop.primaryKey) {
        this.lines.push(`        [Key]`);
      }

      // Add auto-generated Id for primary key type of Guid
      // If this prop is also a foreign key (on weak entity) then pass this
      if (prop.primaryKey && prop.type === "Guid" && !prop.foreignKey) {
        this.lines.push(
          `        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]`
        );
      }

      if (prop.nullable) {
        // nullable string prop won't have '?'
        if (prop.type !== "string") {
          this.lines.push(
            `        public ${prop.type}? ${prop.name} { get; set; }`
          );
        }
      } else {
        this.lines.push(
          `        public required ${prop.type} ${prop.name} { get; set; }`
        );
      }

      // Avoid adding redundant empty line
      if (i < this.entity.props.length - 1) this.lines.push("");
    }
  }

  writeRelationships() {
    if (this.relationships !== null && this.relationships.length > 0) {
      this.lines.push("");

      for (let i = 0; i < this.relationships.length; i++) {
        const rel = this.relationships[i];
        if (rel.end1.table === this.entity.name) {
          // By default, it will add 's' to the name of the collection
          if (rel.end1.cardinality === "1" || rel.end1.cardinality === "0..1") {
            this.lines.push(
              `        public ICollection<${
                rel.end2.table
              }> ${stringUtils.getPluralName(rel.end2.table)} { get; set; }`
            );
          } else if (rel.end1.cardinality === "0..*") {
            this.lines.push(
              `        public ${rel.end2.table} ${rel.end2.table} { get; set; }`
            );
          }
        } else {
          // By default, it will add 's' to the name of the collection
          if (rel.end2.cardinality === "1" || rel.end2.cardinality === "0..1") {
            this.lines.push(
              `        public IList<${
                rel.end1.table
              }> ${stringUtils.getPluralName(rel.end1.table)} { get; set; }`
            );
          } else if (rel.end2.cardinality === "0..*") {
            this.lines.push(
              `        public ${rel.end1.table} ${rel.end1.table} { get; set; }`
            );
          }
        }

        // Avoid adding redundant empty line
        if (i < this.relationships.length - 1) this.lines.push("");
      }
    }
  }

  writeConclusion() {
    this.lines.push("    }");
    this.lines.push("}");
  }

  getData() {
    this.writeUsing();
    this.writeNamespace();
    this.writeClass();
    this.writeProps();
    this.writeRelationships();
    this.writeConclusion();
    return this.lines.join("\n");
  }
}

exports.EntityWriter = EntityWriter;
