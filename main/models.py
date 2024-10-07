from django.db import models

class Property(models.Model):
    name = models.CharField(null=True, max_length=50)
    address = models.TextField()

class Faq_Thumbnail(models.Model):
    faq_group = models.TextField(primary_key=True)
    thumbnail = models.ImageField(upload_to="./faq")

class Faq(models.Model):
    question = models.TextField()
    answer = models.TextField()
    approved = models.BooleanField(default=False)
    group =  models.ForeignKey(Faq_Thumbnail, on_delete=models.DO_NOTHING, null=True, blank=True)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True)

class About(models.Model):
    thumbnail = models.FileField(upload_to="./about", null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    content = models.TextField()
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True)


class Services(models.Model):
    title = models.TextField()
    description = models.TextField()
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="./services")



class Reviews(models.Model):
    user_name = models.TextField()
    content = models.TextField()
    approved = models.BooleanField(default=False)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True)


class Galary(models.Model):
    title = models.TextField(null=True, blank=True)
    img = models.FileField(upload_to="./galary")
    description = models.TextField(null=True, blank=True)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True)


class Contact_Thumbnail(models.Model):
    contact_type = models.TextField(primary_key=True, null=False)
    thumbnail = models.FileField(upload_to="./contact_us", null=True, blank=True)

class Contact(models.Model):
    link = models.TextField()
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True)
    Contact_type = models.ForeignKey(Contact_Thumbnail, on_delete=models.DO_NOTHING,)
