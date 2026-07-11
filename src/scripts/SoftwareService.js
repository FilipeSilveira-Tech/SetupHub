export class SoftwareService {
  constructor() {
    this.softwares = [];
  }

  async getAll() {
    return await window.api.software.getAll();
  }

  async getByCategory(category) {
    const softwares = await this.getAll();
    return softwares.filter((software) => software.categoria === category);
  }

  async getById(id) {
    const softwares = await this.getAll();
    return softwares.find((software) => software.id === id);
  }
}
