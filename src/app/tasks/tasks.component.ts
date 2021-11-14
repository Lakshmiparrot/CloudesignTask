import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  tasks: any[] = [];
  taskAction: boolean = false
  taskForm: any;
  editTaskIndex: any;

  todo = [];
  done = [];
  progress = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const tasks: any = localStorage.getItem('tasks');
    this.tasks = JSON.parse(tasks) || [];
    this.tasks.forEach(e => {
      if (e.status == 'OPENED') {
        this.todo.push(e);
      } else if (e.status == 'IN_PROGRESS') {
        this.progress.push(e);
      } else {
        this.done.push(e);
      }
    });
  }

  addTaskToggle(taskAction = true) {
    this.taskAction = taskAction;
    this.editTaskIndex = null;
    this.taskForm = this.formBuilder.group({
      id: [uuidv4(), Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      date: [new Date()],
    });
  }

  editTaskToggle(task: any, index: any) {
    if (task != undefined && index != undefined && index != null) {
      this.taskAction = true;
      this.editTaskIndex = index;
      this.taskForm = this.formBuilder.group(task)
    }
  }

  addTask() {
    if (this.taskForm.valid) {
      this.tasks.push(this.taskForm.value);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.addTaskToggle(false);
      this.todo = [];
      this.progress = [];
      this.done = [];
      this.tasks.forEach(e => {
        if (e.status == 'OPENED') {
          this.todo.push(e);
        } else if (e.status == 'IN_PROGRESS') {
          this.progress.push(e);
        } else {
          this.done.push(e);
        }
      });
      alert('Task Saved Successfully');
    }
  }

  saveEditTask() {
    if (this.taskForm.valid) {
      this.tasks[this.editTaskIndex] = this.taskForm.value;
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.addTaskToggle(false);
      this.todo = [];
      this.progress = [];
      this.done = [];
      this.tasks.forEach(e => {
        if (e.status == 'OPENED') {
          this.todo.push(e);
        } else if (e.status == 'IN_PROGRESS') {
          this.progress.push(e);
        } else {
          this.done.push(e);
        }
      });
      alert('Edit Task Saved Successfully');
    }
  }

  drop(event: CdkDragDrop<any[]>, type: string): void {
    console.log(event, type);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      let element = event.container.data.filter(e => e.title != type);
      let temp = element[0];
      this.todo = [];
      this.progress = [];
      this.done = [];
      this.tasks.forEach(e => {
        if (e.id == temp.id) {
          e.status = type;
        }
        if (e.status == 'OPENED') {
          this.todo.push(e);
        } else if (e.status == 'IN_PROGRESS') {
          this.progress.push(e);
        } else {
          this.done.push(e);
        }
      });
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

  }

}
