# Generated by Django 4.2.6 on 2025-05-01 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentprofile',
            name='emrolled_teachers',
            field=models.ManyToManyField(blank=True, related_name='enrolled_students', to='lms.teacherprofile'),
        ),
    ]
