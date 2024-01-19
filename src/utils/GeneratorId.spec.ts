import "fake-indexeddb/auto";
import { generateIdWithCustomDate } from "./GeneratorId";
import { describe, it, expect } from "vitest";

describe("We should get match id", () => {

    it("Should id should be matched in fullyear test", () => {
        function testGeneratorId() {
            const year = 2023; // Replace with the desired year
            const startDate = new Date(`${year}-1-1`); // JavaScript's Date constructor uses 0-based month indexing
            const endDate = new Date(`${year}-12-31`);
          
            let currentDate = startDate;
            let week = 1;
          
            while (currentDate <= endDate) {
                
              const testSentence = generateIdWithCustomDate("SUPER_22110000", currentDate);
          
              const weekId = week < 10 ? `0${week}` : week;
              const expectId = `SUPER_23${weekId}0000`;
          
              // Assuming you have a way to test equality in JavaScript (e.g., using assert libraries)
              // Replace this with your actual testing mechanism
              expect(testSentence).toMatch(expectId)
          
              for (let x = 1; x < 10; x++) {

                const currentId = `SUPER_23${weekId}000${x - 1}`;
                const nextId = generateIdWithCustomDate(currentId, currentDate);
                const nextIdExpect = `SUPER_23${weekId}000${x}`;
          
                // Replace this with your actual testing mechanism
                expect(nextId).toBe(nextIdExpect);
              }
          
              currentDate.setDate(currentDate.getDate() + 7); // Advance the date by 7 days
              week++;
            }
          }
          
    })
})