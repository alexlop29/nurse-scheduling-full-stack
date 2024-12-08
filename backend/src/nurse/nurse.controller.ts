import { Controller, Get, Post, Body } from "@nestjs/common";
import { NurseService } from "./nurse.service";
import { NurseEntity } from "./nurse.entity";

@Controller("nurses")
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @Get()
  async getNurses(): Promise<NurseEntity[]> {
    return this.nurseService.getNurses();
  }

  @Get(":id/preferences")
  async getPreferences(@Body("id") id: number): Promise<any> {
    return this.nurseService.getNursePreferences(id);
  }

  @Post(":id/preferences")
  async setPreferences(
    @Body("id") id: number,
    @Body("preferences") preferences: string
  ): Promise<any> {
    return this.nurseService.setPreferences(id, preferences);
  }
}
