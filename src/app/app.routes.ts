import { Routes } from '@angular/router';
import { PageOne } from './page-one/page-one';
import { FirstPage }  from './first-page/first-page';
import { MainPage} from './main-page/main-page';
import { LoginWin } from './login-win/login-win';
import { LayoutView} from './layout-view/layout-view';
import { App } from './app';

export const routes: Routes = [
    { path: '', component: App },
    { path: 'main', component: MainPage },
    { path: 'page1', component: PageOne },
    { path: 'page2', component: FirstPage },
    { path: 'login', component: LoginWin},
    { path: 'layout', component: LayoutView }
];