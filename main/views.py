from django.shortcuts import get_object_or_404
from django.shortcuts import render
from .models import *
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Faq, Faq_Thumbnail
from .serializers import FaqSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    '''
        fetch general about
        fetch all services
        fetch all images
        fetch general faqs
        fetch all reviews general first
        fetch all contact info
    '''
    #properties

    property = Property.objects.all()

    # about
    about = About.objects.all().filter(property=None).first()

    # services
    services = Services.objects.all()

    # gallery
    galary = Gallery.objects.all()

    # FAQ
    # todo: create a table to get the faq section thumbnail images.
    '''
    structure:
        faq = {
            general : {'data' : <obj1, obj2, obj3>, 'thumbnail': img},
            payment : {'data' : <obj1, obj2, obj3>, 'thumbnail': img}
        }
    '''
    faq = {}
    all_faqs = Faq.objects.all().filter(approved=True)
    groups = Faq_Thumbnail.objects.all()
    for group in groups:
        faq[group.faq_group] = {}
        faq[group.faq_group]['data']= all_faqs.filter( group__faq_group =group.faq_group)
        faq[group.faq_group]['thumbnail']= group.thumbnail

    # reviews
    review = Reviews.objects.filter(approved=True).filter(Q(property=None) | Q(property__isnull=False)).order_by('-property')

    # contact
    contact = {}
    phone_map_contact = {}
    all_contacts = Contact.objects.all()
    contact_types = Contact_Thumbnail.objects.all()
    for c_type in contact_types:
        if all_contacts.filter(Contact_type__contact_type=c_type.contact_type).first():
            contact[c_type.contact_type] = {}
            if c_type.contact_type in ['map', 'call', 'phone']:
                phone_map_contact[c_type.contact_type] = {}
                phone_map_contact[c_type.contact_type]= all_contacts.filter(Contact_type__contact_type=c_type.contact_type)
            contact[c_type.contact_type]['link'] = all_contacts.filter(Contact_type__contact_type=c_type.contact_type).first()
            contact[c_type.contact_type]['icon'] = c_type.thumbnail


    return render(request, "index.html", context= {"about": about, "services": services, "galary": galary, "faq": faq, "review": review, "contact": contact, "phone_map_contact":phone_map_contact, "property":property})

@api_view(['POST'])
def get_faqs(request):
    try:
        group_name = request.data.get('faq_group')
        group = Faq_Thumbnail.objects.get(faq_group=group_name)
        all_faqs = Faq.objects.filter(approved=True, group__faq_group=group.faq_group)
        serializer = FaqSerializer(all_faqs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Faq_Thumbnail.DoesNotExist:
        return Response({'error': 'FAQ Group not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)








def submit_faq(request):
    if request.method == 'POST':
        question = request.POST.get('question')
        new_faq = Faq.objects.create(
            question=question,
            answer="",
            approved=False,
            group=Faq_Thumbnail.objects.get(faq_group="general"),
            property=None
        )
        return JsonResponse({'message': 'Query submitted successfully! it will be answered within 24 hours'}, status=200)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)






def submit_review(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        review_content = request.POST.get('review_content')
        new_review = Reviews.objects.create(
            user_name=user_name,
            content=review_content,
            approved=False,
            property=Property.objects.first()
        )
        return JsonResponse({'message': 'Review submitted successfully!'}, status=200)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)




def property_page(request, property_id):
    property = get_object_or_404(Property, id=property_id)

    # About (related to the property)
    about = About.objects.filter(property=property).first()

    # Services (filter related to the property)
    services = Services.objects.filter(property=property)

    # Gallery (filter related to the property)
    galary = Gallery.objects.filter(property=property)

    # FAQ
    faq = {}
    all_faqs = Faq.objects.filter(approved=True, property=property)  # Filter FAQs related to the property
    groups = Faq_Thumbnail.objects.all()
    for group in groups:
        faq[group.faq_group] = {
            'data': all_faqs.filter(group__faq_group=group.faq_group),
            'thumbnail': group.thumbnail
        }

    # Reviews (filter related to the property or global)
    review = Reviews.objects.filter(approved=True).filter(Q(property=property) | Q(property__isnull=True)).order_by('-property')

    # Contact (filter related to the property)
    contact = {}
    phone_map_contact = {}
    all_contacts = Contact.objects.all()
    contact_types = Contact_Thumbnail.objects.all()
    for c_type in contact_types:
        filtered_contacts = all_contacts.filter(Contact_type__contact_type=c_type.contact_type)
        if filtered_contacts.exists():
            contact[c_type.contact_type] = {
                'link': filtered_contacts.first(),
                'icon': c_type.thumbnail
            }
            if c_type.contact_type in ['call', 'phone']:
                phone_map_contact[c_type.contact_type] = filtered_contacts
    contact['map']['link'] = all_contacts.filter(property=property).filter(Contact_type__contact_type='map').first()

    return render(request, "property_index.html", context={"property":property,"about": about,"services": services,"galary": galary,"faq": faq,"review": review,"contact": contact,"phone_map_contact": phone_map_contact})
