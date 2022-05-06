from datetime import datetime
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

class EdtwViewSet(viewsets.ViewSet):
	# Create your views here.
	@action(methods=['GET'],  detail=False, name='Get Value from input' )
	def get_val_from( self, request ):

		input = request.GET[ 'input' ]

		return Response( status=status.HTTP_200_OK,
				data=f"[{ datetime.now() }] input= { input }, value from Django" )