from fastapi import APIRouter
from fastapi.responses import RedirectResponse

__author__ = 'Chu-Chang Ku'
__all__ = ['router']

router = APIRouter(
    prefix='/data',
    tags=['data'],
    responses={404: {'description': 'Not found'}}
)


@router.get('/')
async def get_data_list():
    return {
        'national': 'all',
        'subnational': [
            'area 1', 'area 2'
        ]
    }


@router.get("/national", response_class=RedirectResponse)
async def get_national_data():
    return '/static/Targets.json'
