from rest_framework import viewsets
from .serializers import (
    UserSerializer,
    AllCapsulesSerializer,
    CapsuleSerializer,
    TimelineSerializer,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Capsule, Timeline
import datetime
from geographiclib.geodesic import Geodesic
from django.utils.timezone import make_naive


@api_view(["POST"])
def create_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"id": serializer.data["id"]}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_user(request):
    try:
        email = request.data["email"]
        name = request.data["name"]
    except KeyError:
        return Response(
            {"error": "Email and name are required fields."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email=email, name=name)
        serializer = UserSerializer(user)
        return Response({"id": serializer.data["id"]}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid email or name."}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_timelines(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
        )

    timelines = Timeline.objects.filter(user_id=user_id)
    serializer = TimelineSerializer(timelines, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# TODO : レスポンスの型を相談する
@api_view(["GET"])
def capsules(request, user_id):
    try:
        capsules_by_user_id = Capsule.objects.all()
        # 1,2,3という形式で保存されているmembersとuser_idが一致していればそのカプセルを返す
        capsules_by_user_id_l = [
            capsule
            for capsule in capsules_by_user_id
            if str(user_id) in capsule.members.split(",")
        ]

        serializer = AllCapsulesSerializer(capsules_by_user_id_l, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Capsule.DoesNotExist:
        return Response(
            {"error": "capsule id does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_capsule(request, id):
    print(id)
    try:
        capsules = Capsule.objects.get(id=id)
        serializer = CapsuleSerializer(capsules)
        return Response(
            {
                "id": serializer.data["id"],
                "name": serializer.data["name"],
                "is_open": serializer.data["is_open"],
                "location": serializer.data["location"],
            },
            status=status.HTTP_200_OK,
        )
    except Capsule.DoesNotExist:
        return Response(
            {"error": "capsule id does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_capsule_detail(request, id):
    try:
        capsules = Capsule.objects.get(id=id)
        serializer = CapsuleSerializer(capsules)
        return Response(
            {
                "name": serializer.data["name"],
                "is_open": serializer.data["is_open"],
                "members": serializer.data["members"],
                "location": serializer.data["location"],
                "position_note": serializer.data["position_note"],
                "open_at": serializer.data["open_at"],
                "aikotoba": serializer.data["aikotoba"],
                "text": serializer.data["text"],
                "auto_photo": serializer.data["auto_photo"],
                "photo": serializer.data["photo"],
                "movie": serializer.data["movie"],
                "opened_member": serializer.data["opened_member"],
                "open_requested_at": serializer.data["open_requested_at"],
            },
            status=status.HTTP_200_OK,
        )
    except Capsule.DoesNotExist:
        return Response(
            {"error": "capsule id does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def capsule(request):
    user_emails = request.data["members"].split(",")
    user_ids = []
    for email in user_emails:
        try:
            user_id = User.objects.get(email=email).id
        except User.DoesNotExist:
            return Response(
                {"error": "Member not found."}, status=status.HTTP_400_BAD_REQUEST
            )
        user_ids.append(user_id)

    edit_data = request.data.copy()
    edit_data["members"] = ",".join(map(str, user_ids))
    serializer = CapsuleSerializer(data=edit_data)
    if serializer.is_valid():
        save_return = serializer.save()

        timeline_serializars = []

        for user_id in user_ids:
            timeline_serializar = TimelineSerializer(
                data={
                    "user_id": user_id,
                    "capsule_id": save_return.id,
                    "status": "opened",
                    "message": "Capsule created",
                    "noticed_at": datetime.datetime.now(),
                }
            )
            timeline_serializars.append(timeline_serializar)
            if not timeline_serializar.is_valid():
                return Response(
                    {"error": "Invalid timeline data"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        for timeline_serializar in timeline_serializars:
            timeline_serializar.save()
        return Response(
            {
                "capsule_id": save_return.id,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def start_open_capsule(request, capsule_id):
    # 許容誤差
    THREADHOLD = 10
    TIMER = 60

    try:
        user_id = request.data["user_id"]
        location = request.data["location"]
    except KeyError:
        return Response(
            {"error": "user_id and location are required fields."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        capsule = Capsule.objects.get(id=capsule_id)
    except Capsule.DoesNotExist:
        return Response(
            {"error": "capsule id does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )

    ## capsuleに登録されたメンバーにuser_idが含まれているかどうかを判定する
    if int(user_id) not in list(map(int, capsule.members.split(","))):
        return Response(
            {"error": "User is not a member of this capsule"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ## capsuleのopen_atが現在時刻より過去かどうかを判定する
    if datetime.datetime.now() < make_naive(capsule.open_at):
        return Response(
            {"error": "Capsule could not be opened yet"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ## capsule_locationとlocationが閾値より近いかどうかを判定する
    geod = Geodesic.WGS84
    capsule_location = capsule.location

    try:
        now_lat, now_lon = location.split(",")
        cap_lat, cap_lon = capsule_location.split(",")
    except ValueError:
        return Response(
            {"error": "Invalid location format"}, status=status.HTTP_400_BAD_REQUEST
        )

    distance = geod.Inverse(
        float(now_lat), float(now_lon), float(cap_lat), float(cap_lon)
    )

    print(f"distance:  {distance["s12"]}")
    if distance["s12"] > THREADHOLD:
        return Response(
            {"status": "toofar"},
            status=status.HTTP_200_OK,
        )

    ## カプセルmodelに反映
    print(capsule)

    time_count = datetime.datetime.now() - make_naive(capsule.open_requested_at)
    print(f"time diff: {time_count.total_seconds()}")

    if capsule.opened_member == "" or time_count.total_seconds() > TIMER:
        capsule.open_requested_at = datetime.datetime.now()
        capsule.opened_member = str(user_id)
    else:
        capsule.opened_member = capsule.opened_member + "," + user_id

    capsule.save()

    timer_start_time = capsule.open_requested_at

    print(capsule)

    if len(capsule.opened_member.split(",")) == len(capsule.members.split(",")):
        capsule.is_open = True
        capsule.save()

        return Response(
            {"status": "opened", "start_time": timer_start_time},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"status": "waiting", "start_time": timer_start_time},
            status=status.HTTP_200_OK,
        )


@api_view(["GET"])
def get_capsule_open_result(request, id):
    try:
        capsules = Capsule.objects.get(id=id)

        return Response(
            {
                "is_open": capsules.is_open,
            },
            status=status.HTTP_200_OK,
        )
    except Capsule.DoesNotExist:
        return Response(
            {"error": "capsule id does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )
