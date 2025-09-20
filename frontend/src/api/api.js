import axios, { AxiosError } from 'axios';
import { tokenStore } from '../store/store';


const VITE_URL = import.meta.env.VITE_URL;
const MAIN_URL = VITE_URL ? VITE_URL : '';



async function getAPI(url, params={}) {
    const config = {...params, headers: {'Authorization': `Token ${tokenStore.token}`}};
    try {
        const {data} = await axios.get(`${MAIN_URL}/${url}`, config);
        return { 'success': true, 'result': data };
    }
    catch (e) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                return { 'success': false, 'result': '' };
            }
            if (e.response.status == 401 || e.response.status == 403) {
                window.location.href = '/auth/login/';
                return { 'success': false, 'result': '' };
            }
            return { 'success': false, 'result': e.response.data }; 
        }
    }
}


async function postAPI(url, post_data, params={}) {
    const config = {...params, headers: {'Authorization': `Token ${tokenStore.token}`}};
    try {
        const {data} = await axios.post(`${MAIN_URL}/${url}`, post_data, config);
        return { 'success': true, 'result': data };
    }
    catch (e) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                return { 'success': false, 'result': '' };
            }
            if (e.response.status == 401 || e.response.status == 403) {
                window.location = '/auth/login/';
                return { 'success': false, 'result': '' };
            }
            return { 'success': false, 'result': e.response.data }; 
        }
    }
}


async function patchAPI(url, post_data, params={}) {
    const config = {...params, headers: {'Authorization': `Token ${tokenStore.token}`}};
    try {
        const {data} = await axios.patch(`${MAIN_URL}/${url}`, post_data, config);
        return { 'success': true, 'result': data };
    }
    catch (e) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                return { 'success': false, 'result': '' };
            }
            if (e.response.status == 401 || e.response.status == 403) {
                window.location = '/auth/login/';
                return { 'success': false, 'result': '' };
            }
            return { 'success': false, 'result': e.response.data }; 
        }
    }
}

async function deleteAPI(url, params={}) {
    const config = {...params, headers: {'Authorization': `Token ${tokenStore.token}`}};
    try {
        const {data} = await axios.delete(`${MAIN_URL}/${url}`, config);
        return { 'success': true, 'result': data };
    }
    catch (e) {
        if (e instanceof AxiosError) {
            if (!e.response) {
                return { 'success': false, 'result': '' };
            }
            if (e.response.status == 401 || e.response.status == 403) {
                window.location = '/auth/login/';
                return { 'success': false, 'result': '' };
            }
            return { 'success': false, 'result': e.response.data }; 
        }
    }  
}


export async function getBeltsAPI() {
    const data = await getAPI('api/belts/');
    return data;
}


export async function getBeltDemandsAPI(belt_id) {
    const data = await getAPI(
        'api/belt_demands/used_demands',
        {params: {'belt_id': belt_id}}
    );
    return data;
}


export async function postBeltDemandAPI(belt_id, complex_id) {
    const data = await postAPI(
        'api/belt_demands/',
        {'belt': belt_id, 'complex': complex_id}
    );
    return data;
}


export async function removeBeltDemandAPI(belt_id, complex_id) {
    const data = await deleteAPI(
        'api/belt_demands/remove_demand/',
        {params:{'belt_id': belt_id, 'complex_id': complex_id}}
    );
    return data;
}


export async function getComplexTreeAPI() {
    const data = await getAPI(
        'api/complexes/complex_tree/'
    );
    return data;
  
}


export async function postComplexGroupAPI() {
    const data = await postAPI(
        'api/complex_groups/',
        {'name': 'Новая группа'}
    );
    return data;
}


export async function deleteComplexGroupAPI(group_id) {
    const data = await deleteAPI(
        `api/complex_groups/${group_id}/`
    );
    return data;
}


export async function changeComplexGroupAPI(group_id, name) {
    const data = await patchAPI(
        `api/complex_groups/${group_id}/`,
        {'name': name}
    );
    return data;  
}


export async function getComplexGroupAPI() {
    const data = await getAPI('api/complex_groups/');
    return data;
}


export async function postComplexAPI(group_id) {
    const data = await postAPI(
        'api/complexes/',
        {'name': 'Новый комплекс', 'complex_group': group_id}
    );
    return data;
}


export async function deleteComplexAPI(complex_id) {
    const data = await deleteAPI(
        `api/complexes/${complex_id}/`
    );
    return data;
}


export async function changeComplexAPI(complex_id, name, points) {
    const data = await patchAPI(
        `api/complexes/${complex_id}/`,
        {'name': name, 'points': points}
    );
    return data;  
}


export async function postParticipantAPI() {
    const data = await postAPI(
        'api/participants/',
        {
            'surname': 'Неизвестный',
            'name': 'Неизвестный',
            'patronymic': 'Неизвестный',
            'birth_date': '1900-01-01',
            'belt': '1'
        }
    );
    return data;
}


export async function deleteParticipantAPI(participant_id) {
    const data = await deleteAPI(
        `api/participants/${participant_id}/`
    );
    return data;
}


export async function changeParticipantAPI(participant_id, participant) {
    const data = await patchAPI(
        `api/participants/${participant_id}/`,
        {...participant}
    );
    return data;  
}


export async function getParticipantsAPI() {
    const data = await getAPI(
        'api/participants/'
    );
    return data;
}


export async function postGroupAPI() {
    const data = await postAPI(
        'api/groups/',
        {
            'name': 'Новая подгруппа',
            'year_start': '1900',
            'year_end': '1900',
            'belt_start': '1',
            'belt_end': '1',
            'belt_attestation': '1'
        }
    );
    return data;
}


export async function deleteGroupAPI(group_id) {
    const data = await deleteAPI(
        `api/groups/${group_id}/`
    );
    return data;
}


export async function changeGroupAPI(group_id, group) {
    const data = await patchAPI(
        `api/groups/${group_id}/`,
        {...group}
    );
    return data;  
}


export async function getGroupsTreeAPI() {
    const data = await getAPI(
        'api/groups/groups_tree/'
    );
    return data;
}


export async function getGroupsAPI() {
    const data = await getAPI(
        'api/groups/'
    );
    return data;
}


export async function fillParticipantGroupAPI(group_id) {
    const data = await postAPI(
        'api/groups/fill_group/',
        {'group_id': group_id}
    );
    return data;
}


export async function deleteParticipantGroupAPI(group_id, participant_id) {
    const data = await postAPI(
        'api/groups/remove_participant/',
        {'participant_id': participant_id, 'group_id': group_id}
    );
    return data;
}


export async function appendParticipantGroupAPI(group_id, participant_id) {
    const data = await postAPI(
        'api/groups/append_participant/',
        {'participant_id': participant_id, 'group_id': group_id}
    );
    return data;
}


export async function getParticipantGroupAPI(group_id) {
    const data = await getAPI(
        'api/groups/groups_tree/',
        {params: {group: group_id}}
    );
    return data;
}


export async function getChoiceMenuAPI(url, params) {
    const data = await getAPI(
        url,
        {params: params}
    );
    return data;
}


export async function getAttestationComplexesAPI(participant, complex_group, group_id) {
    const data = await getAPI(
        'api/attestations/change_complex_group/',
        {params: {participant: participant, complex_group: complex_group, group_id: group_id}}
    );
    return data;
}


export async function postAttestationComplexAPI(participant, complex, points) {
    const data = await postAPI(
        'api/attestations/set_points/',
        {participant: participant, complex: complex, points: points}
    );
    return data;
}


export async function restartGroupAPI(group_id) {
    const data = await postAPI(
        'api/attestations/restart_attestation/',
        {group_id: group_id}
    );
    return data;
}


export async function completeGroupAPI(group_id) {
    const data = await getAPI(
        'api/attestations/complete_attestation/',
        {params: {group_id: group_id}}
    );
    return data;
}


export async function getResultsAPI(group_id) {
    const data = await getAPI(
        'api/attestations/results/',
        {params: {group_id: group_id}}
    );
    return data;
}


export async function registerUserAPI(name, password) {
    const data = await postAPI(
        'api/users/',
        { 'username': name, 'password': password }
    );
    return data;
}


export async function getUsersAPI() {
    const data = await getAPI(
      'api/users/'
    );
    return data;
}


export async function getProfileAPI() {
    const data = await getAPI(
      'api/users/me/'
    );
    return data;
}


export async function getTokenAPI(name, password) {
    const data = await postAPI(
        'api/jwt/create/',
      { 'username': name, 'password': password }
    );
    return data;
}


export async function getOptionsAPI() {
    const data = await getAPI(
        'api/options/'
    );
    return data;
}


export async function postOptionsAPI(name, value) {
    const data = await patchAPI(
        'api/options/save_by_name/',
        {'name': name, 'value': value}
    );
    return data;  
}