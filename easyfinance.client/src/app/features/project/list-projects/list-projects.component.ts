import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { mapper } from 'src/app/core/utils/mappings/mapper';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectDto } from '../models/project-dto';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { PageModalComponent } from '../../../core/components/page-modal/page-modal.component';
import { UserProject } from '../../../core/models/user-project';
import { UserProjectDto } from '../models/user-project-dto';
import { Role } from '../../../core/enums/Role';

@Component({
  selector: 'app-list-projects',
  imports: [
    CommonModule,
    AsyncPipe,
    MatGridListModule,
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './list-projects.component.html',
  styleUrl: './list-projects.component.css'
})
export class ListProjectsComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent) ConfirmDialog!: ConfirmDialogComponent;
  private userProjects: BehaviorSubject<UserProjectDto[]> = new BehaviorSubject<UserProjectDto[]>([new UserProjectDto()]);
  userProjects$: Observable<UserProjectDto[]> = this.userProjects.asObservable();
  defaultProjectId$: Observable<string>;

  faPlus = faPlus;
  faEllipsis = faEllipsis;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private translateService: TranslateService) {
    this.defaultProjectId$ = userService.loggedUser$.pipe(map(user => user.defaultProjectId));
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getUserProjects()
      .pipe(map(userProjects => mapper.mapArray(userProjects, UserProject, UserProjectDto)))
      .subscribe(
        {
          next: res => {
            this.userProjects.next(res);
          }
        });
  }

  add(): void {
    this.router.navigate([{ outlets: { modal: ['add-edit-project'] } }]);

    this.dialog.open(PageModalComponent, {
      autoFocus: 'input'
    }).afterClosed().subscribe((result) => {
      this.router.navigate([{ outlets: { modal: null } }]);
    });
  }

  select(userProject: UserProjectDto): void {
    this.projectService.selectUserProject(userProject);

    this.router.navigate(['/projects', userProject.project.id]);
  }

  managePermission(project: ProjectDto) {
    this.router.navigate([{ outlets: { modal: ['projects', project.id, 'users'] } }]);

    this.dialog.open(PageModalComponent, {
      autoFocus: 'input'
    }).afterClosed().subscribe();
  }

  edit(project: ProjectDto): void {
    this.projectService.setEditingProject(project);
    this.router.navigate([{ outlets: { modal: ['add-edit-project'] } }]);

    this.dialog.open(PageModalComponent, {
      autoFocus: 'input'
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadProjects();
      }
    });
  }

  setAsDefault(project: ProjectDto) {
    this.userService.setDefaultProject(project.id).subscribe();
  }

  isAdmin(userProject: UserProjectDto): boolean{
    return userProject.role === Role.Admin;
  }
}
