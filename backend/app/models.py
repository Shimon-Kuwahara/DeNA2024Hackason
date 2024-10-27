from django.db import models

# Create your models here.


class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.email


class Capsule(models.Model):
    name = models.CharField(max_length=255)
    is_open = models.BooleanField(default=False)
    members = models.TextField()
    location = models.TextField()
    position_note = models.TextField()
    open_at = models.DateTimeField()
    aikotoba = models.CharField(max_length=255)
    text = models.TextField()
    auto_photo = models.URLField()
    photo = models.URLField()
    movie = models.URLField()
    # 開封を始めてない場合は空文字列 id列
    opened_member = models.CharField(max_length=255, blank=True)
    open_requested_at = models.DateTimeField()

    def __str__(self):
        return f"{self.name} - {self.is_open} - {self.members} - {self.location} - {self.open_at} - {self.aikotoba} - {self.text} - {self.auto_photo} - {self.photo} - {self.movie} - {self.opened_member} - {self.open_requested_at}"


class Timeline(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    capsule_id = models.ForeignKey(Capsule, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ("opened", "Opened"),
        ("closed", "Closed"),
        ("ready", "Ready"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    message = models.TextField()
    noticed_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user_id.name} - {self.capsule_id.name} - {self.status}"
