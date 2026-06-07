from django.db import migrations

def seed_categories(apps, schema_editor):
    MasterCategory = apps.get_model('categories', 'MasterCategory')
    default_categories = [
        {'category_name': 'Food', 'icon': 'fa-utensils', 'is_default': True},
        {'category_name': 'Transport', 'icon': 'fa-bus', 'is_default': True},
        {'category_name': 'Housing', 'icon': 'fa-home', 'is_default': True},
        {'category_name': 'Utilities', 'icon': 'fa-bolt', 'is_default': True},
        {'category_name': 'Entertainment', 'icon': 'fa-gamepad', 'is_default': True},
        {'category_name': 'Shopping', 'icon': 'fa-shopping-cart', 'is_default': True},
        {'category_name': 'Healthcare', 'icon': 'fa-heartbeat', 'is_default': True},
        {'category_name': 'Education', 'icon': 'fa-graduation-cap', 'is_default': True},
        {'category_name': 'Other', 'icon': 'fa-tag', 'is_default': True}
    ]
    for cat in default_categories:
        MasterCategory.objects.get_or_create(
            category_name=cat['category_name'],
            defaults={'icon': cat['icon'], 'is_default': cat['is_default']}
        )

def remove_categories(apps, schema_editor):
    MasterCategory = apps.get_model('categories', 'MasterCategory')
    MasterCategory.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories, remove_categories),
    ]
