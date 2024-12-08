import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScheduleEntity } from "./schedule.entity";
import { ShiftEntity } from "src/shift/shift.entity";

import { NurseService } from "src/nurse/nurse.service";
import { ShiftService } from "src/shift/shift.service";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly nurseService: NurseService,
    private readonly shiftService: ShiftService
  ) {}

  async generateSchedule(startDate: Date, endDate: Date): Promise<any> {
    // TODO: Complete the implementation of this method

    // get a list of nurses and their preferences
    const nurses = await this.nurseService.getNurses();
    console.log(`nurses`, nurses);
    // console.log(nurses);

    // get list of shift requirements
    const shiftRequirements = await this.shiftService.getShiftRequirements();
    console.log(`shiftRequirements`, shiftRequirements);

    // sort the shift requirements by the number of nurses required
    // follow greedy algorithm principles

    const sorted = shiftRequirements.sort(
      (a, b) => b.nursesRequired - a.nursesRequired
    );
    console.log(`sorted`, sorted);

    let schedule = sorted.map((requirement) => {
      let { nursesRequired, shift, dayOfWeek } = requirement;

      let scheduledNurses = nurses.filter((nurse) => {
        return nurse.preferences?.some((preference: any) => {
          console.log(
            nurse.name,
            preference.shift,
            preference.dayOfTheWeek,
            shift,
            dayOfWeek
          );
          if (
            preference.shift === shift &&
            preference.dayOfTheWeek === dayOfWeek
          ) {
            console.log("match");
            return true;
          }
          return false;
        });
      });

      return {
        ...requirement,
        nurses: scheduledNurses.splice(0, nursesRequired),
      };
    });
    console.log(`schedule`, schedule);

    let index = 0;

    schedule.forEach((requirement) => {
      if (requirement.nurses.length !== requirement.nursesRequired) {
        let nursesNeeded =
          requirement.nursesRequired - requirement.nurses.length;

        let remainingNurses = nurses.length - index;
        if (remainingNurses < nursesNeeded) {
          let nursesToAdd = nurses
            .slice(index)
            .concat(nurses.slice(0, nursesNeeded - remainingNurses));
          requirement.nurses.push(...nursesToAdd);

          index = (nursesNeeded - remainingNurses) % nurses.length;
        } else {
          let nursesToAdd = nurses.slice(index, index + nursesNeeded);

          requirement.nurses.push(...nursesToAdd);

          index += nursesToAdd.length;
        }
      }
    });
    console.log(`filled schedule`, schedule);
    // need to account for potential dup assignments!

    const scheduleEntity = new ScheduleEntity();
    scheduleEntity.shifts = [];
    schedule.forEach((requirement) => {
      requirement.nurses.forEach((nurse) => {
        const shiftEntity = new ShiftEntity();
        shiftEntity.date = requirement.dayOfWeek;
        shiftEntity.type = requirement.shift;
        shiftEntity.nurse = nurse;
        shiftEntity.schedule = scheduleEntity;

        scheduleEntity.shifts.push(shiftEntity);
      });
    });
    await this.scheduleRepository.save(scheduleEntity);

    return scheduleEntity;
  }

  async getSchedules(): Promise<any> {
    return this.scheduleRepository.find();
  }

  async getScheduleById(id: number): Promise<any> {
    return this.scheduleRepository.findOneByOrFail({ id });
  }

  async getScheduleRequirements(): Promise<any> {
    // TODO: Complete the implementation of this method
    // Schedule requirements can be hard-coded
    // Requirements must indicate the number of nurses required for each shift type on each day of a week
    // Create the requirements as JSON and make it available via this method
    throw new NotImplementedException();
  }
}
