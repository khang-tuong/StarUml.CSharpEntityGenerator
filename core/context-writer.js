class ContextWriter {
  constructor(entities, relationships, namespace) {
    this.entities = entities;
    this.relationships = relationships;
    this.namespace = namespace;
    this.lines = [];
  }

  writeUsing() {
    this.lines.push("using Microsoft.EntityFrameworkCore;");
    this.lines.push("");
  }

  writeNamespace() {
    this.lines.push(`namespace ${this.namespace}`);
    this.lines.push("");
  }

  writeStartOfClass() {
    this.lines.push(`public class ApplicationDbContext : DbContext`);
    this.lines.push(`{`);
    this.lines.push(` public ApplicationDbContext() {}`);
    this.lines.push("");
  }

  writeDbSets() {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      this.lines.push(
        `    public DbSet<${entity.name}> ${entity.name} { get; set; }`
      );
    }

    this.lines.push("");
  }

  writeEndOfClass() {
    this.lines.push("}");
  }

  writeRelationships() {
    this.lines.push(
      `    protected override void OnModelCreating(ModelBuilder modelBuilder)`
    );
    this.lines.push(`    {`);
    this.lines.push(`        base.OnModelCreating(modelBuilder);`);

    for (let i = 0; i < this.relationships.length; i++) {
      const rel = this.relationships[i];
      if (rel.end1.cardinality === "1" || rel.end1.cardinality === "0..1") {
        this.lines.push(`        modelBuilder.Entity<${rel.end1.table}>()`);
        this.lines.push(`            .HasMany(x => x.${rel.end2.table}s)`);
        this.lines.push(`            .WithOne(y => y.${rel.end1.table})`);
        this.lines.push(
          `            .HasForeignKey(y => y.${rel.end1.table}Id);`
        );
      } else {
        this.lines.push(`        modelBuilder.Entity<${rel.end2.table}>()`);
        this.lines.push(`            .HasOne(x => x.${rel.end2.table})`);
        this.lines.push(`            .WithMany(y => y.${rel.end1.table}s)`);
        this.lines.push(
          `            .HasForeignKey(x => x.${rel.end2.table}Id);`
        );
      }

      // Avoid adding redundant empty line
      if (i < this.relationships.length - 1) this.lines.push("");
    }

    this.lines.push("    }");
  }

  getLines() {
    this.lines = [];
    this.writeUsing();
    this.writeNamespace();
    this.writeStartOfClass();
    this.writeDbSets();
    this.writeRelationships();
    this.writeEndOfClass();

    return this.lines.join("\n");
  }
}

exports.ContextWriter = ContextWriter;
