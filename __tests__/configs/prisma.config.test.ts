import { PrismaClient } from "@prisma/client";

import { prisma } from "@/configs/prisma.config";

describe("prisma.config", () => {
  afterAll(async (): Promise<void> => {
    await prisma.$disconnect();
  });

  it("should export a PrismaClient instance", () => {
    expect(prisma).toBeInstanceOf(PrismaClient);
  });

  it("should expose connect and disconnect methods", () => {
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.$disconnect).toBe("function");
  });

  it("should export the same instance on repeated requires (singleton)", () => {
    const second = jest.requireActual("@/configs/prisma.config").prisma;

    expect(prisma).toBe(second);
  });
});
