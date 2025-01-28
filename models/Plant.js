class Plant {
    constructor(id, name, strain, plantingDate, stage, notes) {
      this.id = id;
      this.name = name;
      this.strain = strain;
      this.plantingDate = plantingDate;
      this.stage = stage;
      this.notes = notes;
    }
  
    // Optional: Add a method to validate the plant data
    isValid() {
      return (
        this.name &&
        this.strain &&
        this.plantingDate &&
        this.stage &&
        ['Seedling', 'Vegetative', 'Flowering', 'Harvested'].includes(this.stage)
      );
    }
  }
  
  export default Plant;