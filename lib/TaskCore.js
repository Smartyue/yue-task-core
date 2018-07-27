/**
 * Created by yuanjianxin on 2018/7/27.
 */

const schedule=require('node-schedule');

const formatFunction=(taskCore,taskId,func,attach)=>{
    !taskCore.taskMaps.get(taskId).nextInvocation() && taskCore.taskMaps.delete(taskId);
    func(...attach);
};

module.exports=class TaskCore{

    static get instance(){
        if(!TaskCore._instance)
            TaskCore._instance=new TaskCore();
        return TaskCore._instance;
    }

    constructor(){
        this.taskMaps=new Map();
    }

    /**
     * 添加定时任务
     * @param taskId
     * @param rule
     * @param func
     * @param attach
     * @returns {boolean}
     */
    addTask(taskId,rule,func,attach){

        if(this.taskMaps.has(taskId))
            return false;

        try{
            !(attach instanceof Array) && (attach=[attach]);
            let job=schedule.scheduleJob(rule,formatFunction.bind(null,this,taskId,func,attach));
            this.taskMaps.set(taskId,job);
            return true;
        }catch (e){
            console.error("==AddTask Error!==",e);
            return false;
        }
    }


    /**
     * 取消任务
     * @param taskId
     * @returns {boolean}
     */
    removeTask(taskId){
        if(!this.taskMaps.has(taskId))
            return true;
        try{
            let job=this.taskMaps.get(taskId);
            job.cancel();
            this.taskMaps.delete(taskId);
            return true;
        }catch (e){
            console.error("==RemoveTask Error!==",e);
            return false;
        }
    }


    /**
     * 检测任务是否存在
     * @param taskId
     * @returns {boolean}
     */
    isExist(taskId){
        return this.taskMaps.has(taskId);
    }


    /**
     * 获取任务执行时间
     * @param taskId
     * @returns {null}
     */
    getNextInvocation(taskId){
        if(!this.taskMaps.has(taskId))
            return null;
        let job=this.taskMaps.get(taskId);
        return job.nextInvocation();
    }


};