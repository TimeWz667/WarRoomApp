from fastapi import APIRouter, Cookie
from fastapi.responses import JSONResponse
from typing import Optional

__author__ = 'Chu-Chang Ku'
__all__ = ['router']

router = APIRouter(
    prefix='/sim',
    tags=['sim'],
    responses={404: {'description': 'Not found'}}
)


items = list()


@router.get('/sims')
def get_all_simulations():
    return


@router.get('/reset')
def reset_simulations():
    items = list()
    return items


@router.get('/add')
def add_an_intervention():
    items.append(len(items) + 1)
    return items


@router.get('/pop')
def delete_an_intervention():
    items.pop()
    return items


@router.get('/add_cookie')
def add_a_simulation():
    response = JSONResponse(content=items)
    response.set_cookie(key='simulations', value=items)
    return response
