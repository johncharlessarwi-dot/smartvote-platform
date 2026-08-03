export interface Microservice {
  id: string;
  name: string;
  port: number;
  tech: string;
  responsibilities: string[];
}

export interface ArchitectureData {
  projectName: string;
  version: string;
  architectureType: string;
  services: Microservice[];
  prismaSchema: string;
}
