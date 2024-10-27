from django.urls import path, include
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView
from .views import (
    create_user,
    login_user,
    capsules,
    capsule,
    get_capsule,
    get_timelines,
    get_capsule_detail,
    start_open_capsule,
    get_capsule_open_result,
)

urlpatterns = [
    path("signup/", create_user, name="create_user"),
    path("login/", login_user, name="login_user"),
    path("capsules/<int:user_id>/", capsules, name="capsules"),
    path("capsule/<int:id>/", get_capsule, name="get_capsule"),
    path("capsule/<int:id>/detail/", get_capsule_detail, name="get_capsule_detail"),
    path("capsule/", capsule, name="capsule"),
    path(
        "capsule/<int:capsule_id>/open", start_open_capsule, name="start_open_capsule"
    ),
    path(
        "capsule/<int:id>/result/",
        get_capsule_open_result,
        name="get_capsule_open_result",
    ),
    path(
        "schema/",
        get_schema_view(title="任意", description="任意"),
        name="openapi-schema",
    ),
    path("timeline/<int:user_id>", get_timelines, name="get_timelines"),
    path(
        "docs/",
        TemplateView.as_view(  # ドキュメント表示の追加
            template_name="swagger-ui.html",
            extra_context={"schema_url": "openapi-schema"},
        ),
        name="swagger-ui",
    ),
]
