import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <!-- Brand & Mission -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2 text-2xl font-extrabold text-white">
              <span class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-base">
                <i class="fa-solid fa-utensils"></i>
              </span>
              <span>Crave<span class="text-orange-500">Bite</span></span>
            </div>
            <p class="text-xs leading-relaxed text-slate-400">
              Full-featured MEAN Stack Food Delivery Platform. Order your favorite food from top-rated restaurants with lightning fast delivery and live order tracking.
            </p>
            <div class="flex space-x-3 text-slate-400">
              <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"><i class="fa-brands fa-facebook-f text-xs"></i></a>
              <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"><i class="fa-brands fa-twitter text-xs"></i></a>
              <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"><i class="fa-brands fa-instagram text-xs"></i></a>
              <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"><i class="fa-brands fa-github text-xs"></i></a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">Explore</h4>
            <ul class="space-y-2 text-xs">
              <li><a routerLink="/" class="hover:text-orange-400 transition">Home</a></li>
              <li><a routerLink="/restaurants" class="hover:text-orange-400 transition">All Restaurants</a></li>
              <li><a routerLink="/cart" class="hover:text-orange-400 transition">Cart</a></li>
              <li><a routerLink="/orders" class="hover:text-orange-400 transition">Order History</a></li>
            </ul>
          </div>

          <!-- Cuisines -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">Popular Cuisines</h4>
            <ul class="space-y-2 text-xs">
              <li><a routerLink="/restaurants" [queryParams]="{cuisine: 'Burgers'}" class="hover:text-orange-400 transition">Burgers & Fries</a></li>
              <li><a routerLink="/restaurants" [queryParams]="{cuisine: 'Pizza'}" class="hover:text-orange-400 transition">Italian Pizza</a></li>
              <li><a routerLink="/restaurants" [queryParams]="{cuisine: 'Asian'}" class="hover:text-orange-400 transition">Asian & Sushi</a></li>
              <li><a routerLink="/restaurants" [queryParams]="{cuisine: 'Indian'}" class="hover:text-orange-400 transition">Indian Biryani & Curries</a></li>
            </ul>
          </div>

          <!-- MEAN Tech Stack Info -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">MEAN Stack</h4>
            <p class="text-xs text-slate-400 mb-3">Architected and engineered using:</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <span class="bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded flex items-center space-x-1.5">
                <i class="fa-solid fa-database text-green-500"></i>
                <span>MongoDB</span>
              </span>
              <span class="bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded flex items-center space-x-1.5">
                <i class="fa-solid fa-server text-yellow-500"></i>
                <span>Express.js</span>
              </span>
              <span class="bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded flex items-center space-x-1.5">
                <i class="fa-brands fa-angular text-red-500"></i>
                <span>Angular 18</span>
              </span>
              <span class="bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded flex items-center space-x-1.5">
                <i class="fa-brands fa-node text-emerald-400"></i>
                <span>Node.js</span>
              </span>
            </div>
          </div>

        </div>

        <div class="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CraveBite Inc. All rights reserved.</p>
          <p>Built with ❤️ using the full MEAN Stack.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
