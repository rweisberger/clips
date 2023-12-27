import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ManageComponent } from './video/manage/manage.component';
import { UploadComponent } from './video/upload/upload.component';
import { ClipComponent } from './clip/clip.component';

export const routes: Routes = [ 
    {
        path: '', 
        component: HomeComponent
    },
    {
        path: 'about', 
        component: AboutComponent
    },
    {
        path: 'clip/:id', 
        component: ClipComponent
    },
    {
        path: 'manage', 
        component: ManageComponent,
        data: {
            authOnly: true
        }
    },
    {
        path: 'upload', 
        component: UploadComponent,
        data: {
            authOnly: true
        }
    },
];
