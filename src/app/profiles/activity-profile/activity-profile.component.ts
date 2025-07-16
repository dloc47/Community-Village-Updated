import {
  Component,
  inject,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LoaderService } from '../../../services/loader.service';
import { finalize } from 'rxjs/operators';
import { getByIDEndpoints, placeholder } from '../../utils/globalEnums.enum';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Dot,
  Star,
  User,
  Award,
  Globe,
  Compass,
  X,
  Phone,
  Mail,
  Tag,
  Landmark,
  Contact,
  Home,
  Check,
  AppWindow,
  Bed,
  Users,
  Tags,
  CreditCard,
  Share2,
  Banknote,
} from 'lucide-angular';
import { handleImageError, getDistrictClass } from '../../utils/utils';
import { ActivitiesCarouselComponent } from '../../carousels/activities-carousel/activities-carousel.component';

@Component({
  selector: 'app-activity-profile',
  standalone: true,
  templateUrl: './activity-profile.component.html',
  styleUrls: ['./activity-profile.component.css'],
  imports: [CommonModule, LucideAngularModule, ActivitiesCarouselComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivityProfileComponent implements OnInit {
  placeholder: placeholder = placeholder.image;
  activityInfo: any = [];
  showModal: boolean = false;
  selectedImage: string = '';
  relatedActivity: any;
  public handleImageError = handleImageError;
  public getDistrictClasse = getDistrictClass;

  icons = {
    ArrowLeft: ArrowLeft,
    ArrowRight: ArrowRight,
    MapPin: MapPin,
    Dot: Dot,
    Star: Star,
    User: User,
    Award: Award,
    Globe: Globe,
    Compass: Compass,
    X: X,
    Phone: Phone,
    Mail: Mail,
    Tag: Tag,
    Tags: Tags,
    Landmark: Landmark,
    Contact: Contact,
    Home: Home,
    Check: Check,
    Bed: Bed,
    Users: Users,
    CreditCard: CreditCard,
    Share2: Share2,
    AppWindow: AppWindow,
    Banknote: Banknote,
  };

  private apiService = inject(ApiService);
  private loader = inject(LoaderService);
  private routerNav: Router;

  constructor(private activatedRoute: ActivatedRoute, router: Router) {
    this.routerNav = router;
  }

  ngOnInit() {
    this.getFirstSegment();
  }

  getFirstSegment(): boolean {
    let segmentFound = false;
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadActivityData(parseInt(id));
        segmentFound = true;
      } else {
        console.log('No valid ID found in route.');
        this.handleNoDataFound();
      }
    });
    return segmentFound;
  }

  // ✅ Fetch  data
  loadActivityData(id: number): void {
    this.loader.showLoader();
    this.apiService
      .getDataById<any>(getByIDEndpoints.activities, id)
      .pipe(
        finalize(() => {
          this.loader.hideLoader();
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.activityInfo = data;
          } else {
            this.handleNoDataFound();
          }
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          this.handleNoDataFound();
        },
      });
  }

  // Handle no data scenario
  handleNoDataFound() {
    this.loader.hideLoader();
    this.routerNav.navigate(['/not-found']);
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImage = '';
    document.body.style.overflow = 'auto';
  }

  // Prevent modal from closing when clicking inside the modal content
  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
