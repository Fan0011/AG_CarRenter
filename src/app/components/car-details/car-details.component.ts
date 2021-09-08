import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Car } from 'src/app/models/entities/car';
import { CarImage } from 'src/app/models/entities/car-image';
import { CarDetailsService } from 'src/app/services/car-details.service';
import { CarImagesService } from 'src/app/services/car-images.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {
  currentCar: Car;
  carsOfCurrentBrand: Car[] = [];
  carImages: CarImage[] = [];
  dataLoaded: boolean = false;
  constructor(
    private carDetailsService: CarDetailsService,
    private carService: CarService,
    private carImageService: CarImagesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['carid']) {
        this.getCurrentCarDetails(params['carid']).then((res) => {
          this.getCarsOfCurrentBrand();
          this.getCarImagesById(params['carid']).then((res) => {
            console.log(this.carImages.length);
          });
        });
      }
    });
  }

  getCurrentCarDetails(carId: number) {
    return new Promise<void>((resolve, reject) => {
      this.carDetailsService.getCarDetails(carId).subscribe((response) => {
        this.currentCar = response.data;
        this.dataLoaded = true;
        resolve();
      });
    });
  }

  getCarsOfCurrentBrand() {
    this.carService
      .getCarsByBrandId(this.currentCar.brandId)
      .subscribe((response) => {
        this.carsOfCurrentBrand = response.data;

        //Markaya ait diğer araçlar listesinden, mevcut arabayı çıkartıyorum. Mevcut arabayı zaten görüntülüyor.
        let index: number = -1;
        for (let i = 0; i < this.carsOfCurrentBrand.length; i++) {
          if (this.carsOfCurrentBrand[i].id == this.currentCar.id) {
            index = i;
          }
        }
        this.carsOfCurrentBrand.splice(index, 1);
      });
  }

  getCarImagesById(carId: number) {
    return new Promise<void>((resolve, reject) => {
      console.log('metoda girdi');
      this.carImageService.getCarImagesById(carId).subscribe((response) => {
        this.carImages = response.data;
        console.log(this.carImages.length);
        resolve();
      });
    });
  }

  getImagePath(imagePath:string){
    return this.carImageService.imagesFolderPath + imagePath
  }
}