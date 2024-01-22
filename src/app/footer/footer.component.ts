import { Component } from '@angular/core';
import {ConfigService} from "../config.service";
import {NgIf} from "@angular/common";
import {InstitutionConfig} from "../../config";

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  imports: [
    NgIf
  ]
})
export class FooterComponent {
  institutionConfig: InstitutionConfig = new InstitutionConfig()

  constructor(configService: ConfigService) {
    this.institutionConfig = configService.config.institution;
  }
}
