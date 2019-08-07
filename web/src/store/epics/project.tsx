import * as actions from '../actions'
import { Epic } from 'redux-observable'
import {message} from 'antd'
import { mergeMap, map, filter, catchError ,tap} from 'rxjs/operators'
import { bindNodeCallback ,of} from 'rxjs'
import { StoreState } from '@/store/reducers'
import { isActionOf } from 'typesafe-actions'
import { Action ,ActionAny, ProjectListItem, PageData, ResponseOk, ProjectInfo, User, Project} from '@/types'
import * as Api from '@/api'
import { push } from 'connected-react-router'
import { AxiosResponse } from 'axios';

const getProjectList: Epic<Action, Action, StoreState> = action$ =>
  action$.pipe(
    filter(isActionOf(actions.doGetProjectListRequest)),
    mergeMap(action =>
      Api.fetchProjectList().pipe(
        map(({data: { result: { list = [], totalCount = 0} }}: AxiosResponse<ResponseOk<PageData<ProjectListItem>>>) => actions.doGetProjectListSuccess({ list, totalCount })),
        catchError((error) => {
          message.warning(error.message || '查询失败');
          return of(actions.doGetProjectListFailure())
        })
      )
    )
  )

  const getProjectDetail: Epic<Action, Action, StoreState> = action$ =>
  action$.pipe(
    filter(isActionOf(actions.doGetProjectDetailsRequest)),
    mergeMap(action =>
      Api.fetchProjectInfo(action.payload).pipe(
        // map(actions.doGetProjectDetailsSuccess),
        map(({data: { result = {}}}: AxiosResponse<ResponseOk<ProjectInfo>>) => actions.doGetProjectDetailsSuccess(result)),
        catchError(() => {
          return of(actions.doGetProjectDetailsFailure())
        })
      )
    )
  ) 


  const getProjectMembers: Epic<Action, Action, StoreState> = action$ =>
  action$.pipe(
    filter(isActionOf(actions.doGetProjectMembersRequest)),
    mergeMap(action =>
      Api.fetchProjectMembers(action.payload).pipe(
        map(({data: { result: { list = [], totalCount = 0}}}: AxiosResponse<ResponseOk<PageData<User>>>) => actions.doGetProjectMembersSuccess({list, totalCount})),
        catchError(() => {
          return of(actions.doGetProjectMembersFailure())
        })
      )
    )
  )  

const updateProjectDetails: Epic<Action, Action, StoreState> = (action$,state$)=>
  action$.pipe(
    filter(isActionOf(actions.doUpdateProjectDetailsRequest)),
    mergeMap(action=>bindNodeCallback(action.payload.validateFields)().pipe(
      mergeMap(params=>Api.fetchProjectUpdate(state$.value.project.projectInfo.id,params).pipe(
        tap(()=>{message.success('保存成功')}),
        map(()=>actions.doGetProjectDetailsRequest(state$.value.project.projectInfo.id))
      )),
      catchError((error) =>{
        console.log(error)
        message.error(error.message || "更新失败");
        return of(actions.doUpdateProjectDetailsFailure())
      })
    ))
  )

const addProject: Epic<ActionAny, ActionAny, StoreState> = (action$,state$)=>
  action$.pipe(
    filter(isActionOf(actions.doAddProjectRequest)),
    mergeMap(action=>bindNodeCallback(action.payload.validateFields)().pipe(
      mergeMap(params=>Api.fetchProjectAdd(params).pipe(
        tap(()=>{message.success('提交成功')}),
        mergeMap(({data: { result }}: AxiosResponse<ResponseOk<Project>>)=>{
			
			return [
				actions.doAddProjectSuccess(),
				push(`/project/${result.id}`)
			  ]
		})
      )),
      catchError((error) =>{
        console.log(error)
        message.error("请填写正确的项目信息")
        return of(actions.doAddProjectFailure())
      })
    ))
  )


  // const addProjectMemberToggle = (action$) => 
  //     action$.pipe(
  //       filter(isActionOf(actions.doAddProjectMemberToggle)),
  //       map(() => actions.doGetUserListRequest())
  //     )

  const addProjectMember:Epic<Action, Action, StoreState> = (action$, state$) => action$.pipe(
    filter(isActionOf(actions.doAddProjectMemberRequest)),
    mergeMap(action => bindNodeCallback(action.payload.validateFields)().pipe(
      mergeMap(params => Api.fetchProjectMemberAdd(state$.value.project.projectId, params).pipe(
        tap(() => { message.success('添加成功')}),
        mergeMap(response => [
          actions.doAddProjectMemberSuccess(),
          actions.doAddProjectMemberToggle(false),
          // actions.doGetProjectMembersRequest(state$.value.project.projectId)
          actions.doGetProjectDetailsRequest(state$.value.project.projectId)

        ])
      )),
      catchError(error => {
        message.error('添加项目失败');
        return of(actions.doAddProjectMemberFailure())
      })
    ))
  )

  const deleteProjectMember:Epic<Action, Action, StoreState> = (action$, state$) => action$.pipe(
    filter(isActionOf(actions.doDeleteProjectMemberRequest)),
    mergeMap(action => Api.fetchProjectMemberDelete(state$.value.project.projectId, action.payload).pipe(
      tap(() => {message.success('删除成功')}),
      mergeMap(() => [
        actions.doDeleteProjectMemberSuccess(),
        // actions.doGetProjectMembersRequest(state$.value.project.projectId)
        actions.doGetProjectDetailsRequest(state$.value.project.projectId)
      ])
      
    )),
    catchError(error => of(actions.doDeleteProjectMemberFailure()))
  )

  const deleteProject: Epic<Action, Action, StoreState> = (action$) => action$.pipe(
    filter(isActionOf(actions.doDeleteProjectRequest)),
    mergeMap(action => Api.fetchProjectDel(action.payload).pipe(
      tap(() => message.success('删除成功')),
      mergeMap(() => [
        actions.doDeleteProjectSuccess(),
        actions.doGetProjectListRequest()
      ])
      
    )),
    catchError(error => {
      message.error(error.message || '删除失败');
      return of(actions.doDeleteProjectFailure())
    })
  )
export default [
  getProjectList, 
  updateProjectDetails,
  getProjectDetail,
  addProject,
  getProjectMembers, 
  // addProjectMemberToggle, 
  addProjectMember,
  deleteProjectMember,
  deleteProject
]
