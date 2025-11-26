"""
URL configuration for nomade_api project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/onekey/', include('onekey.urls')),
    path('api/accommodations/', include('accommodations.urls')),
    path('api/flights/', include('flights.urls')),
    path('api/car-rentals/', include('car_rentals.urls')),
    path('api/cruises/', include('cruises.urls')),
    path('api/activities/', include('tour_activities.urls')),
    path('api/packages/', include('packages.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payment_processing.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/promotions/', include('promotions.urls')),
    path('api/destinations/', include('destinations.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/support/', include('support.urls')),
    path('api/system-config/', include('system_config.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/security/', include('security.urls')),
]

