import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, MapPin, Phone, Mail } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [LucideAngularModule],
})
export class FooterComponent implements OnInit {
  public icons = {
    MapPin: MapPin,
    Phone: Phone,
    Mail: Mail,
  };

  media = {
    email: 'secy_tourismyahoo.com',
    phone: '03592-232218, 03592-209090',
    address: 'Paryatan Bhawan, Tadong, Gangtok, Sikkim 737102',
  };

  constructor() {}

  ngOnInit() {}
}
