import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.css'
})
export class TabsContainerComponent implements AfterContentInit {
// the lines below are equivalent
  // @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList()

    // this can select projected content

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    )
    if (!activeTabs || activeTabs.length === 0){
      this.selectTab(this.tabs!.first)
    }
  }

  selectTab(tab: TabComponent) {
    // console.log("tab", tab)
    this.tabs?.forEach(tab => {
      tab.active = false
    })
    tab.active = true
    // this is another way to to prevent a default behavior- the address changing- without passing in the
    return false
  }
}
