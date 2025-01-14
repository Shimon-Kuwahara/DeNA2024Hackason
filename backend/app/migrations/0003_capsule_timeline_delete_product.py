# Generated by Django 5.1.2 on 2024-10-26 07:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Capsule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('is_open', models.BooleanField(default=False)),
                ('members', models.TextField()),
                ('location', models.TextField()),
                ('position_note', models.TextField()),
                ('open_at', models.TimeField()),
                ('aikotoba', models.CharField(max_length=255)),
                ('text', models.TextField()),
                ('auto_photo', models.URLField()),
                ('photo', models.URLField()),
                ('movie', models.URLField()),
                ('opened_member', models.CharField(max_length=255)),
                ('open_requested_at', models.TimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Timeline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('opened', 'Opened'), ('closed', 'Closed'), ('ready', 'Ready')], max_length=20)),
                ('message', models.TextField()),
                ('noticed_at', models.DateField()),
                ('capsule_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.capsule')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.user')),
            ],
        ),
        migrations.DeleteModel(
            name='Product',
        ),
    ]
