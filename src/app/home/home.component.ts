import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserManagementService } from '../user-management.service';

interface Coordinates {
  longitude: number;
  latitude: number;
  accuracy: number;
  altitude: number | null;
}

interface ClockInData {
  username: string;
  coordinates: Coordinates;
  address: string;
  datetime: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = [
    'username',
    'longitude',
    'latitude',
    'accuracy',
    'altitude',
    'address',
    'datetime',
  ];
  coordinates: Coordinates;
  rawAddress: any;
  exactAddress: string = '';

  constructor(
    private readonly geolocation$: GeolocationService,
    private userNamagementService: UserManagementService,
    private http: HttpClient
  ) {
    this.coordinates = {
      longitude: -1,
      latitude: -1,
      accuracy: -1,
      altitude: -1,
    };
    let cachedData = localStorage.getItem('clockInData');
    if (cachedData) {
      this.dataSource = JSON.parse(cachedData);
    }
  }
  async ngOnInit() {
    this.coordinates = await this.getLocation();
    this.rawAddress = await this.getAddress();
    this.getExtractAddress();
  }

  async onClockInClicked() {
    console.log('clock in clicked');
    let clockInData: ClockInData = {
      username: this.userNamagementService.currentUser!.username,
      coordinates: this.coordinates,
      address: this.exactAddress,
      datetime: new Date(),
    };

    this.dataSource = [...this.dataSource, clockInData];
    localStorage.setItem('clockInData', JSON.stringify(this.dataSource));
  }

  async onRefreshClicked() {
    this.coordinates = await this.getLocation();
    this.rawAddress = await this.getAddress();
    // this.getExtractAddress();
  }

  async getLocation(): Promise<Coordinates> {
    let position = await firstValueFrom(this.geolocation$);

    return {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
    };
  }

  async getAddress() {
    let response = await firstValueFrom(
      this.http.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.coordinates.latitude},${this.coordinates.longitude}&key=AIzaSyAerf3BexrgA20P-Y0urJJCJvxDNLs0ETQ`
      )
    );
    console.log(response);
    return response;
  }

  getExtractAddress() {
    if (this.rawAddress) {
      this.exactAddress = this.rawAddress.results[0].formatted_address;
    }

    console.log(this.exactAddress);
  }
}
