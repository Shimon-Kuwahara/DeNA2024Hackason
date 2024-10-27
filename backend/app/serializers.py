from rest_framework import serializers
from .models import User, Capsule, Timeline


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name"]


class AllCapsulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capsule
        fields = "__all__"


class CapsuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capsule
        fields = "__all__"


class TimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeline
        fields = "__all__"
