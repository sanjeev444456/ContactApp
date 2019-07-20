import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { ContactModel } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'myapp-all-contacts',
  templateUrl: './all-contacts.component.html',
  styleUrls: ['./all-contacts.component.css']
})
export class AllContactsComponent implements OnInit {
  contacts: Observable<ContactModel[]>;
  nextPageStartIndex = 0;
  totalContacts = 0;
  pagination: number[] = [];

  constructor(private readonly _contactService: ContactService) {
  }

  ngOnInit() {
    this.contacts = (from(this._contactService.getContacts(this.nextPageStartIndex))
      .pipe(
        tap(contacts => {
          this.totalContacts = contacts.total;
          this.nextPageStartIndex = contacts.skip + contacts.limit;
          this.pagination = Array.from(Array(Math.ceil(this.totalContacts / 10)).keys()).map(page => page + 1);
        }),
        pluck('data')
      ) as undefined) as Observable<ContactModel[]>;
  }

  getNextPage() {
    this.contacts = (from(this._contactService.getContacts(this.nextPageStartIndex))
      .pipe(
        tap(contacts => this.nextPageStartIndex = contacts.skip + contacts.limit),
        pluck('data')
      ) as undefined) as Observable<ContactModel[]>;
  }

  getPage(pageNumber: number) {
    this.contacts = (from(this._contactService.getContacts((pageNumber - 1) * 10))
      .pipe(
        tap(contacts => this.nextPageStartIndex = contacts.skip + contacts.limit),
        pluck('data')
      ) as undefined) as Observable<ContactModel[]>;
  }

  getPreviousPage() {
    this.contacts = (from(this._contactService.getContacts(this.nextPageStartIndex))
        .pipe(
          tap(contacts => this.nextPageStartIndex = contacts.skip - contacts.limit),
          pluck('data')) as undefined
    ) as Observable<ContactModel[]>;
  }
}
