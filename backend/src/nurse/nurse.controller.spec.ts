import { Test, TestingModule } from "@nestjs/testing";
import { NurseController } from "./nurse.controller";
import { NurseService } from "./nurse.service";
import { NurseEntity } from "./nurse.entity";
import { ShiftEntity } from "../shift/shift.entity";

describe("NurseController", () => {
  let nurseController: NurseController;
  let nurseService: NurseService;
  const mockNurse: Partial<NurseEntity> = {
    id: 1,
    name: "Alex Lopez",
    preferences: JSON.stringify([
      { shift: "day", dayOfTheWeek: "monday" },
      { shift: "night", dayOfTheWeek: "tuesday" },
    ]),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NurseController],
      providers: [NurseService],
    }).compile();

    nurseController = app.get<NurseController>(NurseController);
    nurseService = app.get<NurseService>(NurseService);
  });

  it("Should return all nurses", async () => {
    const result = [mockNurse];
    jest
      .spyOn(nurseService, "getNurses")
      .mockImplementation(() => Promise.resolve(result));
  });
});
